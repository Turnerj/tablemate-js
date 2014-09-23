//Tablemate - Advanced Cross Tabulation
(function($)
{
	var analysis = $.tablemate.analysis;
	var rendering = $.tablemate.rendering;
	
	analysis.on('analyseTable.start', function(e, TableResult, Options)
	{
		TableResult.isAdvCrossTabulated = false;
	});
	analysis.on('analyseTable.end', function(e, TableResult, Options)
	{
		var rows = TableResult.rows;
		var firstRow = rows[0];
		var secondRow = rows[1];
		
		var tabulationPoints = [];
		
		if (Options.detectCrossTabulation && TableResult.numberOfColumns > 1)
		{
			var lastPoint = null;
			
			for (var i = 0, l = TableResult.numberOfColumns; i < l; i++)
			{
				var frCell = firstRow.columns[i];
				var srCell = secondRow.columns[i];
				
				if ((!frCell.isEmpty && !frCell.isHeading) || (frCell.isEmpty && srCell.isEmpty))
				{
					if (lastPoint)
					{
						lastPoint.end = i - 1;
						lastPoint = null;
					}
				}
				
				if (frCell.isEmpty && srCell.isHeading)
				{
					var point = {
						cell: frCell,
						start: i,
						end: -1
					};
					lastPoint = point;
					tabulationPoints.push(point);
				}
			}
			
			if (lastPoint && lastPoint.end == -1)
			{
				lastPoint.end = TableResult.numberOfColumns - 1;
			}
		}
		
		if (tabulationPoints.length > 1)
		{
			TableResult.isCrossTabulated = false;
			TableResult.isAdvCrossTabulated = true;
			
			$.each(tabulationPoints, function(Index, Point)
			{
				Point.cell.isTabulationStartPoint = true;
				Point.cell.tabulationEndPoint = Point.end;
			});
			
			TableResult.tabulationPoints = tabulationPoints;
		}
	});
	
	
	rendering.add('advCrossTabulation', function($Table, TableAnalysis)
	{
		if (TableAnalysis.isAdvCrossTabulated)
		{
			var $mate = $(this);
			$mate.addClass('advCrossTabulated');
			
			var points = TableAnalysis.tabulationPoints, point = null, columns = null, firstRow = TableAnalysis.rows[0];;
			for (var i = 0, l = points.length; i < l; i++)
			{
				point = points[i];
				
				for (var i2 = point.start + 1, l2 = point.end + 1; i2 < l2; i2++)
				{
					var $block = $('<div class="block"><div class="title"></div></div>');
					var hasAnyRows = false;
					
					$block.find('.title').text(firstRow.columns[i2].title);
					
					for (var i3 = 1, l3 = TableAnalysis.rows.length; i3 < l3; i3++)
					{
						var rowData = TableAnalysis.rows[i3];
						
						if (typeof rowData.columns[i2] == 'undefined')
							continue;
						
						if (rowData.columns[i2].isEmpty)
							continue;
						
						hasAnyRows = true;
						
						var $column = $('<div class="column"><div class="title"></div><div class="data"></div></div>');
						var title = rendering.utilities.getTitleForCell(TableAnalysis.rows, i3, i2, point.start);
						
						$column.find('.title').text(title);
						$column.find('.data').html(rowData.columns[i2].data);
						
						$block.append($column);
						
						i3 = (i3 + rowData.columns[i2].rowspan) - 1;
					}
					
					if (hasAnyRows)
					{
						$mate.append($block);
					}
				}
			}	
			
			/*var firstRow = TableAnalysis.rows[0];
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
			}*/
			
			return true;
		}
	});
	
})(jQuery);
