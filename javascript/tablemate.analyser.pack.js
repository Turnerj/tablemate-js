(function($)
{
	var analysis = $.tablemate.analysis;
	
	//Default Analyser
	analysis.on('analyseTable.start', function(e, Result)
	{
		Result.isRowOfHeadings = true;
	});
	analysis.on('analyseRow.cellAnalysis', function(e, RowResult, CellData, CellIndex, Options)
	{
		var $cell = $(CellData.cell);
		
		CellData.styling = {
			isBold: $cell.css('font-weight') == '700',
			isCentered: $cell.css('text-align') == 'center',
			isFirstChildStrong: $cell.children().length > 0 && $cell.children().get(0).nodeName == 'STRONG'
		}
		
		//Detect if the row is a heading
		if (
			RowResult.isInsideTHead ||
			CellData.tag == 'TH' ||
			(CellData.styling.isBold && CellData.styling.isCentered) ||
			CellData.styling.isFirstChildStrong
		)
		{
			CellData.isHeading = true;
			RowResult.hasAnyHeadings = true;
			
			CellData.data = $.trim($cell.text());
			
			var tmpTitle = $cell.data('title');
			if (!tmpTitle || !tmpTitle.length)
			{
				tmpTitle = CellData.data;
			}
			
			CellData.title = tmpTitle;
		}
		else
		{
			RowResult.isRowOfHeadings = false;
			CellData.data = $cell.html();
		}
		
		//Empty Check
		if ($.trim($cell.text()).length == 0)
		{
			CellData.isEmpty = true;
		}
		else
		{
			RowResult.hasAnyData = true;
		}
		
		//Allow row to still be full of headings if the first column doesn't have data
		if (Options.detectCrossTabulation && CellIndex == 0 && CellData.isEmpty && !CellData.isHeading)
		{
			CellData.isHeading = true;
			RowResult.hasAnyHeadings = true;
			RowResult.isRowOfHeadings = false;
		}
	});
	analysis.on('analyseTable.afterRowAnalysis', function(e, TableResult, RowResult, RowIndex, Options)
	{
		if (RowIndex == 0)
		{
			TableResult.numberOfColumns = RowResult.numberOfColumns;
		}
	});
	
	
	
	
	//Heading-Data Pair
	analysis.on('analyseTable.start', function(e, TableResult)
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
	
	
	
	//Cross Tabulation
	analysis.on('analyseTable.start', function(e, TableResult)
	{
		TableResult.isCrossTabulated = false;
	});
	analysis.on('analyseTable.afterRowAnalysis', function(e, TableResult, RowResult, RowIndex, Options)
	{
		if (RowResult.columns.length > 1)
		{
			if (Options.detectCrossTabulation && RowIndex == 0 && RowResult.columns[0].isEmpty && RowResult.hasAnyHeadings)
			{
				TableResult.isCrossTabulated = true;
			}
		}
	});
	
	
	//Advanced Cross Tabulation
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
