(function($)
{
	$.tablemate.analysis = {
		analyseTable: analyseTable,
		analyseRow: analyseRow,
		utilities: {
			configureCellMapping: configureCellMapping
		}
	};
	
	function analyseTable(Element, Options)
	{
		var $table = $(Element);
		var result = {
			rows: [],
			numberOfColumns: 0,
			isCrossTabulated: false,
			isHeadingDataPair: true
		};
		
		//Analyse Table Width
		var tmpWidth = $table.css('width');
		if (tmpWidth.indexOf('%') != -1)
		{
			result.initialWidth = $table.width();
			result.isInitialWidthPercentage = true;
		}
		else
		{
			result.initialWidth = parseInt(tmpWidth);
			result.isInitialWidthPercentage = false;
		}
		
		//Analyse Data
		//Get all child rows, regardless of thead/tbody/tfoot and without getting any tables inside tables
		var $rows = $($table.get(0).rows);
		
		//Loop Data
		$rows.each(function(RowIndex)
		{
			var $row = $(this);
			var rowData = analyseRow(this, Options);
			
			if (rowData.columns.length > 1)
			{
				if (Options.detectCrossTabulation && RowIndex == 0 && rowData.columns[0].isEmpty && rowData.hasAnyHeadings)
				{
					result.isCrossTabulated = true;
				}
			}
			
			if (RowIndex == 0)
			{
				result.numberOfColumns = rowData.numberOfColumns;
			}
			
			if (!rowData.isHeadingDataPair)
			{
				result.isHeadingDataPair = false;
			}
			
			result.rows.push(rowData);
		});
		
		return result;
	}
	
	function analyseRow(Element, Options)
	{
		var $row = $(Element);
		
		var result = {
			columns: [],
			numberOfColumns: 0,
			isInsideTHead: $row.parent().get(0).nodeName == 'THEAD',
			isRowOfHeadings: true,
			isHeadingDataPair: false,
			hasAnyHeadings: false,
			hasAnyData: false
		};
		
		var $columns = $row.children();
		$columns.each(function(Index)
		{
			var $this = $(this);
			var colData = {
				tag: this.nodeName,
				isBold: $this.css('font-weight') == '700',
				isCentered: $this.css('text-align') == 'center',
				isFirstChildStrong: $this.children().length > 0 && $this.children().get(0).nodeName == 'STRONG',
				isHeading: false,
				isEmpty: false,
				title: null,
				data: null,
				colspan: this.colSpan,
				rowspan: this.rowSpan
			};
			
			result.numberOfColumns += colData.colspan;
			
			//Detect if the row is a heading
			if (
				result.isInsideTHead ||
				colData.tag == 'TH' ||
				(colData.isBold && colData.isCentered) ||
				colData.isFirstChildStrong
			)
			{
				colData.isHeading = true;
				result.hasAnyHeadings = true;
				
				colData.data = $.trim($this.text());
				
				var tmpTitle = $this.data('title');
				if (!tmpTitle || !tmpTitle.length)
				{
					tmpTitle = colData.data;
				}
				
				colData.title = tmpTitle;
			}
			else
			{
				result.isRowOfHeadings = false;
				
				colData.data = $this.html();
			}
			
			//Empty Check
			if ($.trim($this.text()).length == 0)
			{
				colData.isEmpty = true;
			}
			else
			{
				result.hasAnyData = true;
			}
			
			//Allow row to still be full of headings if the first column doesn't have data
			if (Options.detectCrossTabulation && Index == 0 && colData.isEmpty && !colData.isHeading)
			{
				colData.isHeading = true;
				result.hasAnyHeadings = true;
				result.isRowOfHeadings = false;
			}
			
			result.columns.push(colData);
		});
		
		//Check if the row is a heading/data pair
		if ($columns.length == 2 && result.columns[0].isHeading && !result.columns[1].isHeading)
		{
			result.isHeadingDataPair = true;
		}
		
		return result;
	}
	
	function configureCellMapping(Table)
	{
		var $table = $(Table), $rows = $(Table.rows), columnCount = 0;
			
		$rows.each(function(RowIndex)
		{
			//Setup cell mapping data structure
			
			if (RowIndex == 0)
			{
				columnCount = this.cells.length;
			}
			
			var $row = $(this), cells = [];
			cells.length = columnCount;
			
			$row.data('cells', cells);
		}).each(function(RowIndex)
		{
			//Build map of cells and rows
			
			var $row = $(this);
			$cells = $(this.cells);
			$cells.each(function(ColIndex)
			{
				var cells = $row.data('cells'), trueIndex = 0;
				
				//Insert current cell into map
				for (var i = 0, l = cells.length; i < l; i++)
				{
					if (typeof cells[i] == 'undefined')
					{
						//Make the map be correct with the column span
						for (var i2 = 0, l2 = this.colSpan; i2 < l2; i2++)
						{
							cells[i + i2] = this;
						}
						trueIndex = i;
						break;
					}
				}
				
				$row.data('cells', cells);
				
				//Insert current cell into map for additional rows it spans to
				if (this.rowSpan > 1)
				{
					for (var i = RowIndex + 1, l = RowIndex + this.rowSpan; i < l; i++)
					{
						var $tmpRow = $rows.eq(i);
						var cells = $tmpRow.data('cells');
						
						//Make the map be correct with the column span
						for (var i2 = 0, l2 = this.colSpan; i2 < l2; i2++)
						{
							cells[trueIndex + i2] = this;
						}
						$tmpRow.data('cells', cells);
					}
				}
			});
		});
	}
	
})(jQuery);
