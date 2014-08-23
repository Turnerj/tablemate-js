(function($)
{
	//Utilities
	function loop(Data, Callback)
	{
		for (var i = 0, l = Data.length; i < l; i++)
		{
			var result = Callback.call(Data, i, Data[i]);
			if (result === false)
				return false;
		}
		return true;
	}
	
	$.tablemate.parse = {
		evaluateData: function(Data)
		{
			var result = {
				canParse: false,
				parsers: [],
				data: Data
			}
			
			for (var parser in this.parsers)
			{
				if (typeof this.parsers[parser].check == 'function')
				{
					var parserResult = this.parsers[parser].check.call(this.parsers[parser], Data);
					if (parserResult === true)
						result.parsers.push(parser);
				}
			}
			
			result.canParse = result.parsers.length > 0;
			
			return result;
		},
		performParse: function(EvalResultOrData, SpecificParser)
		{
			var result = null;
			if (typeof EvalResultOrData == 'object' && EvalResultOrData.length > 0)
			{
				result = this.evaluateData(EvalResultOrData);
			}
			else
			{
				result = EvalResultOrData;
			}
			
			if (!result.canParse)
				return false;
			
			var parser = result.parsers[0];
			
			if (typeof SpecificParser == 'string')
			{
				for (var i = 0, l = result.parsers.length; i < l; i++)
				{
					if (result.parsers[i] == SpecificParser)
					{
						parser = SpecificParser;
						break;
					}
				}
			}
			
			if (typeof this.parsers[parser] == 'object')
			{
				return this.parsers[parser].parse.call(this.parsers[parser], result.data);
			}
			
			return false;
		},
		parsers: {
			timeRange: {
				timeRegex: /\d{1,2}(:|[.])\d{2}(\s|)(am|pm)/ig,
				check: function(Data)
				{
					var isRange = true;
					var regex = this.timeRegex;
					
					loop(Data, function(Index, Value)
					{
						if (typeof Value == 'string' && Value.length > 0)
						{
							if (Value.match(regex) == null)
							{
								isRange = false;
								return false;
							}
						}
					});
					
					return isRange;
				},
				parse: function(Data)
				{
					var firstResult = null, lastResult = null;
					
					loop(Data, function(Index, Value)
					{
						if (typeof Value == 'string' && Value.length > 0)
						{
							if (firstResult == null)
								firstResult = Value;
							
							lastResult = Value;
						}
					});
					
					var beginTimeMatches = firstResult.match(this.timeRegex);
					var endTimeMatches = lastResult.match(this.timeRegex);
					
					if (beginTimeMatches != null)
					{
						var beginTime = beginTimeMatches[0];
						var endTime = endTimeMatches[endTimeMatches.length - 1];
						
						if (beginTime == endTime)
						{
							return beginTime;
						}
						else
						{
							return beginTime + ' - ' + endTime;
						}
					}
					
					return null;
				}
			}
		}
	}
	
})(jQuery);
