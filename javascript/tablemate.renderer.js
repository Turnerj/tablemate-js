(function($)
{
	$.tablemate.rendering = {
		renderers: {},
		add: function(Name, Callback)
		{
			$.tablemate.rendering.renderers[Name] = Callback;
		},
		enableBreak: function($Table)
		{
			var data = $Table.data('tablemate');
			var $mate = $('<div></div>');
			
			$mate.addClass('tablemate');
			
			var renderers = $.tablemate.rendering.renderers;
			var hasRendered = false;
			
			for (var name in renderers)
			{
				var renderer = renderers[name];
				if (typeof renderer == 'function')
				{
					var result = renderer.call($mate, $Table, data.analysis);
					if (result === true)
					{
						hasRendered = true;
						break;
					}
				}
			}
			
			if (hasRendered)
			{
				$Table.after($mate);
			}
			
			return hasRendered;
		},
		disableBreak: function($Table)
		{
			$Table.next('div.tablemate').remove();
		},
		utilities: {
			getTitleForCell: function(Rows, RowIndex, ColumnIndex)
			{
				var titles = [];
				var rowData = Rows[RowIndex];
				var cellData = rowData.columns[ColumnIndex];
				
				for (var i = RowIndex, l = RowIndex + cellData.rowspan; i < l; i++)
				{
					var tmpRow = Rows[i];
					if (typeof tmpRow == 'object')
					{
						titles.push(tmpRow.columns[0].title);
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
