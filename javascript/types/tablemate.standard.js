//Tablemate - Standard
(function($)
{
	var analysis = $.tablemate.analysis;
	var rendering = $.tablemate.rendering;
	
	/*analysis.on('analyseTable.start', function(e, TableResult)
	{
		TableResult.isHeadingDataPair = true;
	});
	analysis.on('analyseRow.end', function(e, RowResult)
	{
		//Check if the row is a heading/data pair
		if (RowResult.numberOfColumns == 2 && RowResult.columns[0].isHeading && !RowResult.columns[1].isHeading)
		{
			RowResult.isHeadingDataPair = true;
		}
	});
	analysis.on('analyseTable.afterRowAnalysis', function(e, TableResult, RowResult, RowIndex, Options)
	{
		if (!RowResult.isHeadingDataPair)
		{
			TableResult.isHeadingDataPair = false;
		}
	});
	
	
	
	rendering.add('headingDataPair', function($Table, TableAnalysis)
	{
		if (TableAnalysis.isHeadingDataPair)
		{
			var $mate = $(this);
			$mate.addClass('headingDataPair');
			
			var $block = $('<div class="block"></div>');
			
			//TODO: Possibly need to take into account rowspan on the columns, like I do on the cross tabulated data
			for (var i = 0, l = TableAnalysis.rows.length; i < l; i++)
			{
				var rowData = TableAnalysis.rows[i];
				
				if (rowData.columns[0].isEmpty || rowData.columns[1].isEmpty)
					continue;
				
				var $column = $('<div class="column"><div class="title"></div><div class="data"></div></div>');
				
				$column.find('.title').text(rowData.columns[0].title);
				$column.find('.data').html(rowData.columns[1].data);
				
				$block.append($column);
			}
			
			$mate.append($block);
			
			return true;
		}
	});*/
	
})(jQuery);
