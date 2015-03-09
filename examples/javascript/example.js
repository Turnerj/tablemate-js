//Tablemate source files
var loadFiles = [
	'src/tablemate.js',
	'src/tablemate.analysis.js',
	'src/tablemate.default-analyser.js',
	'src/tablemate.parsers.js',
	'src/tablemate.renderer.js',
	'src/tablemate.tests.js',
	'src/types/tablemate.standard.js',
	'src/types/tablemate.heading-data-pair.js',
	'src/types/tablemate.cross-tabulation.js',
	'src/tablemate.init.js'
];

//CSS Injector Utility
function addStylesheet(Stylesheet)
{
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = Stylesheet;
	document.getElementsByTagName('head')[0].appendChild(link);
}

//Script Injector Utility
function addScript(Script, OnLoad)
{
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = Script;
	script.onload = OnLoad;
	document.getElementsByTagName('head')[0].appendChild(script);
}

if (location.search.indexOf('without') == -1)
{
	var baseHref = '../';	
	addStylesheet(baseHref + 'src/tablemate.css');

	(function recursiveLoad(Stack)
	{
		var path = Stack.shift();
		if (path)
		{
			addScript(baseHref + path, function()
			{
				recursiveLoad(Stack);
			});
		}
	})(loadFiles);
}