//Tablemate - Standard
(function($)
{
	var analysis = $.tablemate.analysis;
	var rendering = $.tablemate.rendering;
	
	analysis.on('analyseTable.end', function(e, TableResult, Options)
	{
		var basicDataTopHeadings = true, basicDataSideHeadings = true;
		for (var i = 0, l = TableResult.rows.length; i < l; i++)
		{
			var row = TableResult.rows[i];
			if ((i == 0 && !row.isRowOfHeadings) || (i > 0 && row.hasAnyHeadings))
			{
				basicDataTopHeadings = false;
			}
			
			for (var i2 = 0, l2 = row.columns.length; i2 < l2; i2++)
			{
				var column = row.columns[i2];
				if ((i2 == 0 && !column.isHeading) || (i2 > 0 && column.isHeading))
				{
					basicDataSideHeadings = false;
					break;
				}
			}
		}
		
		if (basicDataTopHeadings)
		{
			TableResult.detectedAs.push('basicDataTopHeadings');
		}
		
		if (basicDataSideHeadings)
		{
			TableResult.detectedAs.push('basicDataSideHeadings');
		}
	});
	
	
	//TODO: Update this so that each block is a row, each column has the title from the top headings, the value being the corresponding column
	//		Currently this is otherwise fairly useless in showing data
	rendering.add('basicDataTopHeadings', {
		perform: function($Table, TableAnalysis)
		{
			var $mate = $(this);
			$mate.addClass('basicDataTopHeadings');
			
			var firstRowColumns = TableAnalysis.rows[0].columns;
			for (var i = 0, l = firstRowColumns.length; i < l; i++)
			{	
				if (firstRowColumns[i].isEmpty)
				{
					continue;
				}
						
				var $block = $('<div class="block"><div class="title"></div></div>');
				$block.find('.title').text(firstRowColumns[i].title);
				
				for (var i2 = 1, l2 = TableAnalysis.rows.length; i2 < l2; i2++)
				{
					var column = TableAnalysis.rows[i2].columns[i];
					if (column.isEmpty)
					{
						continue;
					}				
					
					var $column = $('<div class="column"><div class="data"></div></div>');
				
					$column.find('.data').html(column.data);
				
					$block.append($column);
				}
				
				$mate.append($block);
			}
		}
	});
	
	rendering.add('basicDataSideHeadings', {
		perform: function($Table, TableAnalysis)
		{
			var $mate = $(this);
			$mate.addClass('basicDataSideHeadings');
			
			var firstRowColumns = TableAnalysis.rows[0].columns;
			for (var i = 0, l = TableAnalysis.rows.length; i < l; i++)
			{	
				var columns = TableAnalysis.rows[i].columns;
				if (columns[0].isEmpty)
				{
					continue;
				}
						
				var $block = $('<div class="block"><div class="title"></div></div>');
				$block.find('.title').text(columns[0].title);
				
				for (var i2 = 1, l2 = columns.length; i2 < l2; i2++)
				{
					var column = columns[i2];
					if (column.isEmpty)
					{
						continue;
					}				
					
					var $column = $('<div class="column"><div class="data"></div></div>');
				
					$column.find('.data').html(column.data);
				
					$block.append($column);
				}
				
				$mate.append($block);
			}
		}
	});
	
})(jQuery);
