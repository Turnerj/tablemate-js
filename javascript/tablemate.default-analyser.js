(function($)
{
	var analysis = $.tablemate.analysis;
	
	//Default Analyser
	analysis.on('analyseRow.start', function(e, Result)
	{
		$.extend(Result, {
			isInsideTHead: $(Result.row).parent().get(0).nodeName == 'THEAD',
			isRowOfHeadings: true,
			isHeadingDataPair: false,
			hasAnyHeadings: false,
			hasAnyData: false
		});
	});
	analysis.on('analyseRow.cellAnalysis', function(e, RowResult, CellData, CellIndex, Options)
	{
		var $cell = $(CellData.cell);
		
		$.extend(CellData, {
			isHeading: false,
			isEmpty: false,
			title: null,
			data: null
		});
		
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
	});
	analysis.on('analyseTable.afterRowAnalysis', function(e, TableResult, RowResult, RowIndex, Options)
	{
		if (RowIndex == 0)
		{
			TableResult.numberOfColumns = RowResult.numberOfColumns;
		}
	});
	
		
})(jQuery);
