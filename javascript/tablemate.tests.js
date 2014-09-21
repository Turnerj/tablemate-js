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
			//This checks the class names of the table to see if any tests should be run
			var classes = this.className.split(/\s+/);
			for (var i = 0, l = classes.length; i < l; i++)
			{
				if (classes[i].indexOf('test') === 0)
				{
					$.tablemate.tests.runTest(classes[i].substr(4), this);
				}
			}
		},
		runTest: function(Test, Table)
		{
			//Performs a single test on the table
			var test = $.tablemate.tests['test' + Test];
			if (typeof test == 'function')
			{
				test.call(Table);
				return true;
			}
			return false;
		},
		
		//===== TESTS =====
		
		testColumnMapping: function(Data)
		{
			//This is a purely visual test without any automated testing.
			//The idea is to check that the column colours line up. The 
			//more complex the table (multiple rowSpans and colSpans),
			//the more useful the test.
						
			var $table = $(this), $rows = $(this.rows);
			
			//Add a colour block to every mapped cell
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
						
					var nextCount = $cell.children('.testColumnMapping').filter(function()
					{
						return $(this).data('index') == colourIndex;
					}).length + 1;
					
					var $testBlock = $('<div class="testColumnMapping" data-index="' + colourIndex + '" style="background:'+colours[colourIndex]+';">' + nextCount + '</div>');
					$testBlock.on('mouseover', function()
					{
						$cells.addClass('highlight');
					}).on('mouseout', function()
					{
						$cells.removeClass('highlight');
					});
					
					$cell.append($testBlock);
					
					colourIndex++;
				});
			});
		},
		
		testAdvCrossTabulation: function(Data)
		{
			//This is a purely visual test without any automated testing.
			//The idea is to check that the colours correspond to advanced
			//cross-tabulation of the data
			
			var analysis = $(this).data('tablemate').analysis;
			var rows = analysis.rows, startPoints = analysis.tabulationStartPoints;
			
			//Add a colour block representing the different cross-tabulated
			//tables inside the main table
			var firstRow = rows[0];
			var secondRow = rows[1];
			
			$.each(firstRow.columns, function(ColumnIndex, Column)
			{
				var secondRowColumn = secondRow.columns[ColumnIndex];
				
			});
			
			/*rows.each(function(RowIndex, Row)
			{
				var colourIndex = 0, colours = $.tablemate.tests.columnColours;
				var $row = $(this), $cells = $($row.data('cells'));
				Row.columns.each(function(ColumnIndex, Column)
				{
					if (this == window)
						return;
					
					var $cell = $(Column.cell);
					
					if (colourIndex >= colours.length)
						colourIndex = 0;
					
					
					
					
					var $testBlock = $('<div class="testColumnMapping" data-index="' + colourIndex + '" style="background:'+colours[colourIndex]+';">' + nextCount + '</div>');
					$testBlock.on('mouseover', function()
					{
						$cells.addClass('highlight');
					}).on('mouseout', function()
					{
						$cells.removeClass('highlight');
					});
					
					$cell.append($testBlock);
					
					colourIndex++;
				});
			});*/
		}
	};
})(jQuery);
