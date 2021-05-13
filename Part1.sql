--Part 1: Q1
-- Because the Ids from documents are primary keys, they should all be unique,
-- and as a result, there should not be any duplicates.  This means we are safe to use
-- the all keyword here as it is generally faster for performance, if the datasets had
-- duplicates we could perform some analysis and see whether it's better for our use
-- cases to dedupe in the query itself, or whether it is better in our case to dedupe
-- the results later in processing.  The tradeoff being whether we take the hit to
-- performance when making database reads from our query, limiting our transactions,
-- or whether we take slightly longer in processing it to dedupe if needed.
select id from documents
EXCEPT all -- Remove 'All' keyword to make this query not contain duplicates
select document_id from pages;

--Part 1: Q2
SELECT
title,
COUNT(pages.id) AS pages
FROM reports
INNER JOIN documents on documents.report_id = reports.id                        -- Intersection of documents/reports
INNER JOIN pages on pages.document_id = documents.id                            -- Intersection of documents/pages
WHERE reports.id = documents.report_id and documents.id = pages.document_id     -- Filter for pages matching report only in count
GROUP BY title                                                                  -- Group table results by report title

--Part 1: Q3
-- For creating a comments table, I would create a new table (comments) with foreign keys for
-- each of the existing tables to map it to them.  If comments are allowed to be made across
-- multiple (e.g. leave a comment on the report, document, and page) then It would look like
-- the Example A below, while if comments should only be left on one of the three, then I
-- would implement it with a constraint to restrict it so that only one of the three foreign keys
-- can be set, shown in Example B below.  Alternatively, if the comments are mutually exclusive,
-- I'd look into the existing dependencies to see what the LoE would be on adding a comment
-- column to the existing tables, and see how the additional data would affect existing performance,
-- and whether any existing monitoring systems would need to be updated to reflect it, such as snowflake tables.
-- If there is an upper limit on the length of comments, then a max size would be enforced.  In both Example A and B,
-- it would be a many to many relationship, with three foreign key fields, and one text field, the only difference being
-- whether a constraint is used to enforce that only one foreign key is present to identify what the comment refers to.
-- With the other approach, if a new column were added, it would be a singular comment field, optionally with a max length
-- added to the reports, documents, and pages tables.

-- Example A
create table comments(id INTEGER PRIMARY KEY,
					  report_id INTEGER REFERENCES reports(id),
					  document_id INTEGER REFERENCES documents(id),
					  page_id INTEGER REFERENCES pages(id),
					  comment TEXT);
-- Example B
create table comments(id INTEGER PRIMARY KEY,
					  report_id INTEGER REFERENCES reports(id),
					  document_id INTEGER REFERENCES documents(id),
					  page_id INTEGER REFERENCES pages(id),
					  comment TEXT,
					  CONSTRAINT chk_table check ((report_id is not null and document_id is null and page_id is null) 
    												or (document_id is not null and report_id is null and page_id is null)
    												or (page_id is not null and report_id is null and document_id is null))
                      );