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
	
})(jQuery);
