(function($)
{
	$.tablemate.tests = {
		columnColours: ['#FF0000','#00FF00','#0000FF','#FFD800'],
		setup: function(Data)
		{
			//$.tablemate.tests.testColumnPosition.call(this, Data);
			$.tablemate.tests.testColumnPosition2.call(this, Data);
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
		}
	};
})(jQuery);
