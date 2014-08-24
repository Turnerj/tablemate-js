(function($)
{
	$.tablemate.tests = {
		columnColours: [
			'#FF0000','#00FF00','#0000FF','#FFD800','#FF00DC',
			'#00FFFF','#FF6A00','#00FF6E','#A100FF','#9BC3FF',
			'#FFD093','#E2FF9B'
		],
		setup: function(Data)
		{
			var $table = $(this);
			if ($table.hasClass('testColumnPosition'))
				$.tablemate.tests.testColumnPosition.call(this, Data);
			
			if ($table.hasClass('testColumnPosition2'))
				$.tablemate.tests.testColumnPosition2.call(this, Data);
			
			if ($table.hasClass('testColumnPosition3'))
				$.tablemate.tests.testColumnPosition3.call(this, Data);
		},
		testColumnPosition: function(Data)
		{
			var $this = $(this), $rows = $(this.rows);
			$rows.each(function()
			{
				var colourIndex = 0, colours = $.tablemate.tests.columnColours;
				var $row = $(this), $cells = $(this.cells);
				$cells.each(function()
				{
					var $cell = $(this);
					
					if (colourIndex >= colours.length)
						colourIndex = 0;
					
					$cell.append('<div class="testBlock" style="background:'+colours[colourIndex]+';"></div>');
					
					colourIndex++;
				});
			});
		},
		testColumnPosition2: function(Data)
		{
			var $this = $(this), $rows = $(this.rows);
			
			function getAllCellsInRow(Row)
			{
				var $row = $(Row);
				var allCells = $.makeArray(Row.cells);
				var cells = $row.data('spannedCells');
				
				if (cells)
				{
					for (var i = 0, l = cells.length; i < l; i++)
					{
						var cell = cells[i];
						allCells.splice(cell.index, 0, cell.element);
					}
				}
				
				return allCells;
			}
			
			function setSpannedRows(RowIndex, RowSpan, ColIndex)
			{
				for (var i = RowIndex + 1, l = RowIndex + RowSpan; i < l; i++)
				{
					var $row = $rows.eq(i), data = $row.data();
					
					if (!data.spannedCells)
					{
						data.spannedCells = [];
					}
					
					data.spannedCells.push({
						index: ColIndex,
						element: this
					});
					
					$row.data(data);
				}
			}
			
			$rows.each(function(RowIndex)
			{
				var colourIndex = 0, colours = $.tablemate.tests.columnColours;
				var $row = $(this), $cells = $(getAllCellsInRow(this));
				$cells.each(function(ColIndex)
				{
					var $cell = $(this);
					
					if (this.rowSpan > 1 && this.parentNode == $row[0])
					{
						setSpannedRows.call(this, RowIndex, this.rowSpan, ColIndex);
					}
					
					if (colourIndex >= colours.length)
						colourIndex = 0;
					
					$cell.append('<div class="testBlock" style="background:'+colours[colourIndex]+';"></div>');
					
					colourIndex++;
				});
			});
		},
		testColumnPosition3: function(Data)
		{
			var $this = $(this), $rows = $(this.rows), columnCount = 0;
			
			//Setup cell data
			$rows.each(function(RowIndex)
			{
				if (RowIndex == 0)
				{
					columnCount = this.cells.length;
				}
				
				var $row = $(this), cells = [];
				cells.length = columnCount;
				
				//$row.data('cells', $.makeArray(this.cells));
				$row.data('cells', cells);
			});
			
			//Set the spanned cells
			$rows.each(function(RowIndex)
			{
				var $row = $(this);
				$cells = $(this.cells);
				$cells.each(function(ColIndex)
				{
					var cells = $row.data('cells'), trueIndex = 0;
					for (var i = 0, l = cells.length; i < l; i++)
					{
						if (typeof cells[i] == 'undefined')
						{
							for (var i2 = 0, l2 = this.colSpan; i2 < l2; i2++)
							{
								cells[i + i2] = this;
							}
							trueIndex = i;
							break;
						}
					}
					
					$row.data('cells', cells);
					
					if (this.rowSpan > 1)
					{
						for (var i = RowIndex, l = RowIndex + this.rowSpan; i < l; i++)
						{
							var $tmpRow = $rows.eq(i);
							var cells = $tmpRow.data('cells');
							
							for (var i2 = 0, l2 = this.colSpan; i2 < l2; i2++)
							{
								cells[trueIndex + i2] = this;
							}
							$tmpRow.data('cells', cells);
						}
					}
				});
			});
			
			//Set colour
			$rows.each(function(RowIndex)
			{
				var colourIndex = 0, colours = $.tablemate.tests.columnColours;
				var $row = $(this), $cells = $($row.data('cells'));
				$cells.each(function()
				{
					if (this == window)
						return;
					
					var $cell = $(this);
					
					if (colourIndex >= colours.length)
						colourIndex = 0;
					
					$cell.append('<div class="testBlock" style="background:'+colours[colourIndex]+';"></div>');
					
					colourIndex++;
				});
			});
		}
	};
})(jQuery);
