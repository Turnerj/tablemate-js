(function($)
{
	$.tablemate.renderer = {
		renderBreakMate: renderBreakMate,
		removeBreakMate: removeBreakMate
	};
	
	function renderBreakMate($Table)
	{
		var data = $Table.data('tablemate'), analysis = data.analysis;
		
		var $mate = $('<div></div>');
		$mate.addClass('tablemate');
		
		//Utilities
		function parseTitleInput(Input, Table)
		{
			//TODO: Clean this up! Several puppies could pass away with this function :(
			
			for (var parser in $.tablemate.parsers)
			{
				var result = $.tablemate.parsers[parser].call(Table, Input);
				if (typeof result == 'string')
					return result;
			}
			
			return Input;
		}
		
		
		if (analysis.isHeadingDataPair)
		{
			$mate.addClass('headingDataPair');
			
			var $block = $('<div class="block"></div>');
			
			//TODO: Possibly need to take into account rowspan on the columns, like I do on the cross tabulated data
			for (var i = 0, l = analysis.rows.length; i < l; i++)
			{
				var rowData = analysis.rows[i];
				
				if (rowData.columns[0].isEmpty || rowData.columns[1].isEmpty)
					continue;
				
				var $column = $('<div class="column"><div class="title"></div><div class="data"></div></div>');
				
				$column.find('.title').text(rowData.columns[0].title);
				$column.find('.data').text(rowData.columns[1].data);
				
				$block.append($column);
			}
			
			$mate.append($block);
			
		}
		else if (analysis.isCrossTabulated)
		{
			$mate.addClass('crossTabulated');
			
			//TODO: Handle data when there are multiple heading columns in the table? Die horribly? Detect and don't care?
			
			function getTitlesForRowSpan(Rows, Start, Length, Table)
			{
				var titles = [];
				for (var i = Start, l = Start + Length; i < l; i++)
				{
					titles.push(analysis.rows[i].columns[0].title);
				}
				
				var title = null;
				
				var parseResult = $.tablemate.parse.performParse(titles, null, analysis, Start, Length);
				if (typeof parseResult == 'string')
				{
					title = parseResult;
				}
				else
				{
					//I know this doesn't have spaces between the commas but this will likely be changed later
					title = titles.toString();
				}
				
				return title;
			}
			
			var firstRow = analysis.rows[0];
			for (var i = 1, l = firstRow.columns.length; i < l; i++)
			{
				if (firstRow.columns[i].isEmpty)
					continue;
				
				var $block = $('<div class="block"><div class="title"></div></div>');
				var hasAnyRows = false;
				$block.find('.title').text(firstRow.columns[i].title);
				
				for (var i2 = 1, l2 = analysis.rows.length; i2 < l2; i2++)
				{
					var rowData = analysis.rows[i2];
					
					if (typeof rowData.columns[i] == 'undefined')
						continue;
					
					if (rowData.columns[i].isEmpty)
						continue;
					
					hasAnyRows = true;
					
					var $column = $('<div class="column"><div class="title"></div><div class="data"></div></div>');
					var title = rowData.columns[0].title;
					
					var rowspan = rowData.columns[i].rowspan;
					if (rowspan > 1)
					{
						title = getTitlesForRowSpan(analysis.rows, i2, rowspan);
					}
					
					$column.find('.title').text(title);
					$column.find('.data').html(rowData.columns[i].data);
					
					$block.append($column);
				}
				
				if (hasAnyRows)
				{
					$mate.append($block);
				}
			}
		}
		else
		{
			console.log('Edge-case reached!', analysis);
			
			//TODO: Need to refine what the edge cases could be and how we should handle them
		}
		
		$Table.after($mate);
	}
	function removeBreakMate($Table)
	{
		$Table.next('div.tablemate').remove();
	}
	
	
})(jQuery);
