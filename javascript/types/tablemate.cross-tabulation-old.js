//Tablemate - Cross Tabulation
(function($)
{
	var analysis = $.tablemate.analysis;
	var rendering = $.tablemate.rendering;
	
	analysis.on('analyseTable.start', function(e, TableResult, Options)
	{
		TableResult.isCrossTabulated = false;
	});
	analysis.on('analyseTable.end', function(e, TableResult, Options)
	{
		var rows = TableResult.rows;
		var firstRow = rows[0];
		
		if (TableResult.numberOfColumns > 1)
		{
			if (Options.detectCrossTabulation && firstRow.columns[0].isEmpty && firstRow.hasAnyHeadings)
			{
				TableResult.isCrossTabulated = true;
			}
		}
	});
	
	
	rendering.add('crossTabulation', function($Table, TableAnalysis)
	{
		if (TableAnalysis.isCrossTabulated)
		{
			var $mate = $(this);
			$mate.addClass('crossTabulated');
			
			//TODO: Handle data when there are multiple heading columns in the table? Die horribly? Detect and don't care?
			
			var firstRow = TableAnalysis.rows[0];
			for (var i = 1, l = firstRow.columns.length; i < l; i++)
			{
				if (firstRow.columns[i].isEmpty)
					continue;
				
				var $block = $('<div class="block"><div class="title"></div></div>');
				var hasAnyRows = false;
				$block.find('.title').text(firstRow.columns[i].title);
				
				for (var i2 = 1, l2 = TableAnalysis.rows.length; i2 < l2; i2++)
				{
					var rowData = TableAnalysis.rows[i2];
					
					if (typeof rowData.columns[i] == 'undefined')
						continue;
					
					if (rowData.columns[i].isEmpty)
						continue;
					
					hasAnyRows = true;
					
					var $column = $('<div class="column"><div class="title"></div><div class="data"></div></div>');
					var title = rendering.utilities.getTitleForCell(TableAnalysis.rows, i2, i);
					
					$column.find('.title').text(title);
					$column.find('.data').html(rowData.columns[i].data);
					
					$block.append($column);
					
					i2 = (i2 + rowData.columns[i].rowspan) - 1;
				}
				
				if (hasAnyRows)
				{
					$mate.append($block);
				}
			}
			
			return true;
		}
	});
	
})(jQuery);
