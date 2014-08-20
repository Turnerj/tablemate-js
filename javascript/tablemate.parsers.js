(function($)
{
	$.tablemate.parse = {
		evaluateText: function(Text)
		{
			var result = {
				canParse: false,
				parsers: [],
				text: Text
			}
			
			for (var parser in this.parsers)
			{
				if (typeof this.parsers[parser].check == 'function')
				{
					var parserResult = this.parsers[parser].check.call(null, Text);
					if (parserResult === true)
						result.parsers.push(parser);
				}
			}
			
			result.canParse = result.parsers.length > 0;
			
			return result;
		},
		performParse: function(EvalResultOrText, SpecificParser, Analysis, Row, NumberOfRows)
		{
			var result = null;
			if (typeof EvalResultOrText == 'string')
			{
				result = this.evaluateText(EvalResultOrText);
			}
			else
			{
				result = EvalResultOrText;
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
				return this.parsers[parser].parse.call(Analysis, result.text, Row, NumberOfRows);
			}
			
			return false;
		},
		parsers: {
			timeRange: {
				check: function(Input)
				{
					
				},
				parse: function(Input, Row, NumberOfRows)
				{
					
				}
			}
		}
	}
	
})(jQuery);
