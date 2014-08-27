//Tablemate - Advanced Cross Tabulation
(function($)
{
	var analysis = $.tablemate.analysis;
	var rendering = $.tablemate.rendering;
	
	analysis.on('analyseTable.end', function(e, TableResult, $Rows)
	{
		var rows = TableResult.rows;
		var firstRow = rows[0];
		var secondRow = rows[1];
		
		for (var i = 0, l = TableResult.numberOfColumns; i < l; i++)
		{
			var frCell = firstRow.columns[i];
			var srCell = secondRow.columns[i];
			
			if (frCell.isEmpty && srCell.isHeading)
			{
				//TODO: This is successful like normal cross tabulation
				//		I need to detect multiple of these happening at once
			}
			
		}
	});
	
})(jQuery);
