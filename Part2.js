/* Model
 * For heavier use cases I'd typically bump this store to a models folder or file,
 * for simplicity here, it's kept in the same file
 */
const store = {
    document: {
    8: { id: 8, report_id: 4, name: 'Sample Document', filetype: 'txt' },
    34: { id: 34, report_id: 21, name: 'Quarterly Report', filetype: 'pdf' },
    87: { id: 87, report_id: 21, name: 'Performance Summary', filetype: 'pdf' },
    },
    page: {
    19: { id: 19, document_id: 34, body: 'Lorem ipsum...', footnote: null },
    72: { id: 72, document_id: 87, body: 'Ut aliquet...', footnote: 'Aliquam erat...' },
    205: { id: 205, document_id: 34, body: 'Donec a dui et...', footnote: null },
    },
    report: {
    4: { id: 4, title: 'Sample Report' },
    21: { id: 21, title: 'Portfolio Summary 2020' },
    },
}

/* Part 2: Q1
 * The pageMap function iterates through pages and maps the page count
 * to the corresponding report Id.  The runtime of it should be O(n) where n = page entries.
 * Reports without pages are then found by filtering the keys of reports with pages from the
 * report object keys, and creating entries for the difference with 0 pages
 */
function pageMap() {
    let documents = store.document;
    let pages = store.page;
    let reports = store.report;
    //return variable
    let reportPageMap = new Object();
  
    Object.keys(pages).forEach(key => {
        let reportId = documents[pages[key].document_id].report_id;
        if (reportPageMap[reportId] !== undefined) {
        	reportPageMap[reportId] += 1;
        } else {
        	reportPageMap[reportId] = 1;
        }
    });

	let missingReports = Object.keys(reports).filter(x => Object.keys(reportPageMap).indexOf(x) === -1);
	missingReports.forEach(reportId => reportPageMap[reportId] = 0);
  
    return reportPageMap;
}

let pMap = pageMap();

/* Part 2: Q2
 * The searchStore function iterates through the entries of store.report, store.document, and store.page and for each key/value pair.
 * It does this by iterating through the keys of each (reports, documents, pages), performing a null check, and checking the searchable
 * fields for the search text, if a match is found, it checks if the report Id is already added to the return variable, and adds it
 * if it is not yet added.  The runtime here is O(n) where N is the total number of entries combined across reports, documents, 
 * and pages, since each must be checked once.
 */
function searchStore(str) {
    let reports = store.report;
    let documents = store.document;
    let pages = store.page;

    //return variable
    let matchingReports = [];

    //Search Reports
    Object.keys(reports).forEach(key => {
        if (reports[key].title !== null && reports[key].title.includes(str)) {
            if (matchingReports.indexOf(reports[key].id) === -1) matchingReports.push(reports[key].id);
        }
    });

    //Search Documents
	Object.keys(documents).forEach(key => {
        if (documents[key].name !== null && documents[key].name.includes(str)) {
            if (matchingReports.indexOf(documents[key].report_id) === -1) matchingReports.push(documents[key].report_id);
        }
    });

    //Search Pages
    Object.keys(pages).forEach(key => {
        if (pages[key].body !== null && pages[key].body.includes(str) || pages[key].footnote !== null && pages[key].footnote.includes(str)) {
           	let reportId = documents[pages[key].document_id].report_id;
            if (matchingReports.indexOf(reportId) === -1) matchingReports.push(reportId);
        }
    });

    return matchingReports;
}

let searchResults = searchStore('erat');

/* Part 2: Q3
 * A:
 * Asynchronous functions in Javascript rely on promises.  Async functions
 * in Javascript are always guranteed to return a promise.  The Await keyword
 * works inside of async functions to wait for the promise to settle before
 * resuming code execution.  One restriction of this is that await cannot be
 * used in top-level code, and must be wrapped in an async function (though we
 * can wrap it in an anonymous async function).  To mimic the usage of the API call,
 * we are using the await keyword on the import function to load the data.
 */

async function aSearchStore(str) {
    try{
        // This is where we'd make the actual API call
        let {store} = await import('./models.js');
                
        let reports = store.report;
        let documents = store.document;
        let pages = store.page;

        //return variable
        let matchingReports = [];

        //Search Reports
        Object.keys(reports).forEach(key => {
            if (reports[key].title !== null && reports[key].title.includes(str)) {
                if (matchingReports.indexOf(reports[key].id) === -1) matchingReports.push(reports[key].id);
            }
        });

        //Search Documents
        Object.keys(documents).forEach(key => {
            if (documents[key].name !== null && documents[key].name.includes(str)) {
                if (matchingReports.indexOf(documents[key].report_id) === -1) matchingReports.push(documents[key].report_id);
            }
        });

        //Search Pages
        Object.keys(pages).forEach(key => {
            if (pages[key].body !== null && pages[key].body.includes(str) || pages[key].footnote !== null && pages[key].footnote.includes(str)) {
                let reportId = documents[pages[key].document_id].report_id;
                if (matchingReports.indexOf(reportId) === -1) matchingReports.push(reportId);
            }
        });

        return matchingReports;
    } catch(e) {
        console.log(e);
        return "Search Function Error";
    }
}

let results = await aSearchStore('Sample');

/* B:
 * If the async function can produce errors, we can handle it one of two ways
 * we can either wrap the call in a try...catch block (example above), or we can call
 * .catch() on the function call itself (example below) to handle the async function error.
 * Failing to do this will result in an unhandled promise rejection error if the promise
 * is rejected.  In certain frameworks, a global unhandled promise rejection error handler
 * could also be used to handle them.
 */

const aSearchStore2 = async (str) => {
    // This is where we'd make the actual API call
    let {store} = await import('./models.js').catch(error => {
        throw Error("Search Function Error");
    });
            
    let reports = store.report;
    let documents = store.document;
    let pages = store.page;

    //return variable
    let matchingReports = [];

    //Search Reports
    Object.keys(reports).forEach(key => {
        if (reports[key].title !== null && reports[key].title.includes(str)) {
            if (matchingReports.indexOf(reports[key].id) === -1) matchingReports.push(reports[key].id);
        }
    });

    //Search Documents
	Object.keys(documents).forEach(key => {
        if (documents[key].name !== null && documents[key].name.includes(str)) {
            if (matchingReports.indexOf(documents[key].report_id) === -1) matchingReports.push(documents[key].report_id);
        }
    });

    //Search Pages
    Object.keys(pages).forEach(key => {
        if (pages[key].body !== null && pages[key].body.includes(str) || pages[key].footnote !== null && pages[key].footnote.includes(str)) {
           	let reportId = documents[pages[key].document_id].report_id;
            if (matchingReports.indexOf(reportId) === -1) matchingReports.push(reportId);
        }
    });

    return matchingReports;
}


let results2 = await aSearchStore2('a');
let results2b = await aSearchStore2('Lorem');
let results2c = await aSearchStore2('erat');

console.log("PageMap: " + Object.entries(pMap));
console.log("Search: " + searchResults.toString());
console.log("Async Search 1: " + results.toString());
console.log("Async Search 2: " + results2.toString());
console.log("Async Search 2: " + results2b.toString());
console.log("Async Search 2: " + results2c.toString());