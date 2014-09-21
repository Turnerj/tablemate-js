(function($)
{
	$.tablemate.analysis = {
		analyseTable: analyseTable,
		analyseRow: analyseRow,
		
		on: onEvent,
		trigger: triggerEvent,
		utilities: {
			configureCellMapping: configureCellMapping
		}
	};
	
	function onEvent(Event, Func)
	{
		$($.tablemate.analysis).on(Event, Func);
	}
	function triggerEvent(Event, Data)
	{
		$($.tablemate.analysis).triggerHandler(Event, Data);
	}
	
	function analyseTable(Table, Options)
	{
		configureCellMapping(Table);
		
		var $table = $(Table);
		var result = {
			rows: [],
			numberOfColumns: 0
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
		
		triggerEvent('analyseTable.start', [ result, Options ]);
		
		//Analyse Data
		//Get all child rows, regardless of thead/tbody/tfoot and without getting any tables inside tables
		var $rows = $(Table.rows);
		
		//Loop Data
		$rows.each(function(RowIndex)
		{
			var rowData = analyseRow(this, Options);
			rowData.index = RowIndex;
			
			triggerEvent('analyseTable.afterRowAnalysis', [ result, rowData, RowIndex, Options ]);
			result.rows.push(rowData);
		});
		
		triggerEvent('analyseTable.end', [ result, Options ]);
		
		return result;
	}
	
	function analyseRow(Element, Options)
	{
		var $row = $(Element);
		
		var result = {
			row: Element,
			columns: [],
			numberOfColumns: 0
		};
		
		var $cells = $($row.data('cells'));
		result.numberOfColumns = $cells.length;
		
		triggerEvent('analyseRow.start', [ result, Options ]);
		
		$cells.each(function(ColIndex)
		{
			var cellData = {
				cell: this,
				index: ColIndex,
				tag: this.nodeName,
				colspan: this.colSpan,
				rowspan: this.rowSpan
			};
			
			triggerEvent('analyseRow.cellAnalysis', [ result, cellData, ColIndex, Options ]);
			result.columns.push(cellData);
		});
		
		triggerEvent('analyseRow.end', [ result, Options ]);
		
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
				var tmpCount = 0;
				$(this.cells).each(function()
				{
					tmpCount += this.colSpan;
				});
				columnCount = tmpCount;
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
				var $cell = $(this), cellRows = [];
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
				cellRows.push($row[0]);
				
				//Insert current cell into map for additional rows it spans to
				if (this.rowSpan > 1)
				{
					for (var i = RowIndex + 1, l = RowIndex + this.rowSpan; i < l; i++)
					{
						var $tmpRow = $rows.eq(i);
						var cells = $tmpRow.data('cells');
						
						cellRows.push($tmpRow[0]);
						
						//Make the map be correct with the column span
						for (var i2 = 0, l2 = this.colSpan; i2 < l2; i2++)
						{
							cells[trueIndex + i2] = this;
						}
						$tmpRow.data('cells', cells);
					}
				}
				
				$cell.data('rows', cellRows);
			});
		});
	}
	
})(jQuery);
