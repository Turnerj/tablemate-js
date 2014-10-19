(function($)
{
	$.tablemate.rendering = {
		renderers: {},
		add: function(Name, Options)
		{
			$.tablemate.rendering.renderers[Name] = Options;
		},
		enableBreak: function($Table, Options)
		{
			var hasRendered = false;
			var data = $Table.data().tablemate;
			var detectedAs = data.analysis.detectedAs;
			var $mate =  $('<div></div>').addClass('tablemate');
			
			for (var i = 0, l = detectedAs.length; i < l; i++)
			{
				var renderer = this.renderers[detectedAs[i]];
				
				if (typeof renderer == 'undefined')
				{
					continue;
				}
				
				//Allow the renderer to run an additional check before committing
				//to being used for the table.
				if (
					typeof renderer.check == 'function' && 
					renderer.check.call($Table, data.analysis) === false
				)
				{
					continue;
				}
				
				if (typeof renderer.perform == 'function')
				{
					renderer.perform.call($mate, $Table, data.analysis);		
					$Table.after($mate);
					hasRendered = true;
					$.tablemate.log('Break Rendered', '(Detected As: ' + detectedAs[i] + ')', $Table[0]);
					break;
				}
			}
			
			if (!hasRendered)
			{
				$.tablemate.log('No Renderer Found', $Table[0]);
			}
			
			return hasRendered;
		},
		disableBreak: function($Table)
		{
			$Table.next('div.tablemate').remove();
		},
		utilities: {
			getTitleForCell: function(Rows, RowIndex, ColumnIndex, TitleIndex)
			{
				var titles = [];
				var rowData = Rows[RowIndex];
				var cellData = rowData.columns[ColumnIndex];
				
				for (var i = RowIndex, l = RowIndex + cellData.rowspan; i < l; i++)
				{
					var tmpRow = Rows[i];
					if (typeof tmpRow == 'object')
					{
						titles.push(tmpRow.columns[TitleIndex || 0].title);
					}
				}
				
				var title = null;
				var parseResult = $.tablemate.parse.performParse(titles, null);
				
				if (typeof parseResult == 'string')
				{
					title = parseResult;
				}
				else
				{
					title = titles.join(', ');
				}
				
				return title;
			}
		}
	};
	
})(jQuery);
