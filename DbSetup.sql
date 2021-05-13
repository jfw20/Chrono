create table reports(id INTEGER PRIMARY KEY, title VARCHAR);
create table documents (
  id INTEGER PRIMARY KEY,
  report_id INTEGER REFERENCES reports,
  name VARCHAR,
  filetype VARCHAR);
create table pages(id INTEGER PRIMARY KEY,
                   document_id INTEGER REFERENCES documents,
                   body TEXT,
                   footnote TEXT);

-- not exclusive
create table comments(id INTEGER PRIMARY KEY,
					  report_id INTEGER REFERENCES reports(id),
					  document_id INTEGER REFERENCES documents(id),
					  page_id INTEGER REFERENCES pages(id),
					  comment TEXT);

-- mutually exclusive
create table comments(id INTEGER PRIMARY KEY,
					  report_id INTEGER REFERENCES reports(id),
					  document_id INTEGER REFERENCES documents(id),
					  page_id INTEGER REFERENCES pages(id),
					  comment TEXT,
					  CONSTRAINT chk_table check ((report_id is not null and document_id is null and page_id is null) 
    												or (document_id is not null and report_id is null and page_id is null)
    												or (page_id is not null and report_id is null and document_id is null))
                      );

insert into reports (id, title) values (4, 'Sample Report');
insert into reports (id, title) values (21, 'Portfolio Summary 2020');
insert into reports (id, title) values (29, 'One Page Report');

insert into documents (id, report_id, name, filetype) values (8, 4, 'Sample Document', 'txt');
insert into documents (id, report_id, name, filetype) values (34, 21, 'Quarterly Report', 'pdf');
insert into documents (id, report_id, name, filetype) values (87, 21, 'Performance Summary', 'pdf');
insert into documents (id, report_id, name, filetype) values (90, 29, 'One Page Document', 'pdf');

insert into pages (id, document_id, body, footnote) values (19, 34, 'Lorem ipsum...', null);
insert into pages (id, document_id, body, footnote) values (72, 87, 'Ut aliquet...', 'Aliquam erat...');
insert into pages (id, document_id, body, footnote) values (205, 34, 'Donec a dui et...', null);
insert into pages (id, document_id, body, footnote) values (208, 90, 'Page One.', null);

insert into comments (id, report_id, document_id, page_id, comment) values (1, 4, null, null, 'This is a sample comment.');
insert into comments (id, report_id, document_id, page_id, comment) values (8, null, null, 19, 'Lorem ipsum...');
insert into comments (id, report_id, document_id, page_id, comment) values (70, null, null, 19, 'Ut aliquet...');
--insert into comments (id, report_id, document_id, page_id, comment) values (72, 4, 8, null, 'This comment will not insert.') -- Test statement to validate mutually exclusive comment