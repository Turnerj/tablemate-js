//Tablemate - Advanced Cross Tabulation
(function($)
{
	var analysis = $.tablemate.analysis;
	var rendering = $.tablemate.rendering;
	
	//Set Tablemate Default for detecting cross tabulation
	$.tablemate.defaults.analyse.detectCrossTabulation = true;
	
	analysis.on('analyseTable.start', function(e, TableResult, Options)
	{
		TableResult.isCrossTabulated = false;
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
		
		if (tabulationPoints.length > 0)
		{
			TableResult.isCrossTabulated = true;
			
			$.each(tabulationPoints, function(Index, Point)
			{
				Point.cell.isTabulationStartPoint = true;
				Point.cell.tabulationEndPoint = Point.end;
			});
			
			TableResult.tabulationPoints = tabulationPoints;
			TableResult.detectedAs.push('crossTabulation');
		}
	});
	
	
	rendering.add('crossTabulation', {
		perform: function($Table, TableAnalysis)
		{
			var $mate = $(this);
			$mate.addClass('crossTabulation');
			
			var points = TableAnalysis.tabulationPoints, point = null, 
				columns = null, firstRow = TableAnalysis.rows[0];;
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
		}
	});
	
})(jQuery);
