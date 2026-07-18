import React from 'react';

const Box = ({ children, tone = 'default', className = '' }: { children: React.ReactNode; tone?: 'default' | 'good' | 'bad'; className?: string }) => (
  <div
    className={`rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed bg-neutral-50 dark:bg-neutral-900 ${
      tone === 'good'
        ? 'border-l-[3px] border-l-blue-500 dark:border-l-blue-400 border-y-neutral-200 border-r-neutral-200 dark:border-y-neutral-800 dark:border-r-neutral-800 text-neutral-800 dark:text-neutral-200'
        : tone === 'bad'
        ? 'border-neutral-200 dark:border-neutral-800 border-dashed text-neutral-500 dark:text-neutral-500'
        : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
    } ${className}`}
  >
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-sans font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-2">{children}</div>
);

const Arrow = () => <div className="text-neutral-300 dark:text-neutral-600 text-center text-xs leading-none py-1">↓</div>;

const Note = ({ children, center = false }: { children: React.ReactNode; center?: boolean }) => (
  <div className={`text-[12px] font-sans text-neutral-500 dark:text-neutral-400 leading-relaxed ${center ? 'text-center' : ''}`}>{children}</div>
);

/* Terminal-style wireframe chrome */
const Terminal = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
    <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
      <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      <span className="ml-2 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">{title}</span>
    </div>
    <div className="px-3 py-3 font-mono text-[11px] leading-[1.8] text-neutral-700 dark:text-neutral-300 overflow-x-auto">{children}</div>
  </div>
);

const NPlusOne = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label>The loop — 340 queries</Label>
      <Box>SELECT * FROM students</Box>
      <Arrow />
      <Box tone="bad">SELECT * FROM departments WHERE id = 1</Box>
      <Arrow />
      <Box tone="bad">SELECT * FROM departments WHERE id = 2</Box>
      <Arrow />
      <div className="text-center font-mono text-[11px] text-neutral-400 dark:text-neutral-500 py-1">… ×337 more</div>
    </div>
    <div>
      <Label>The join — 1 query</Label>
      <Box tone="good">
        SELECT s.*, d.name
        <br />
        FROM students s
        <br />
        JOIN departments d ON d.id = s.dept_id
      </Box>
      <div className="mt-3">
        <Note>Same data. The ORM hides the left side inside an innocent-looking property access.</Note>
      </div>
    </div>
  </div>
);

const QueryPlanner = () => (
  <div>
    <div className="flex flex-col items-center">
      <Box className="w-full sm:w-auto sm:min-w-[280px] text-center">SELECT * FROM orders WHERE user_id = 7</Box>
      <Arrow />
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-center">
        <div className="font-sans font-semibold text-[12px] text-neutral-800 dark:text-neutral-200">Query planner</div>
        <div className="font-sans text-[11px] text-neutral-400 dark:text-neutral-500">estimates cost, picks a strategy</div>
      </div>
      <Arrow />
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="flex flex-col gap-1.5">
          <Box tone="good" className="text-center">Index Scan<br />seek → read a few rows</Box>
          <Note center>table has a usable index</Note>
        </div>
        <div className="flex flex-col gap-1.5">
          <Box tone="bad" className="text-center">Seq Scan<br />read every single row</Box>
          <Note center>no index fits, or planner thinks it's cheaper</Note>
        </div>
      </div>
    </div>
  </div>
);

const ExplainOutput = () => (
  <div>
    <Terminal title="psql — EXPLAIN ANALYZE">
      <div className="text-neutral-400 dark:text-neutral-500">=# EXPLAIN ANALYZE SELECT * FROM messages WHERE chat_id = 42;</div>
      <div className="mt-2 text-neutral-500 dark:text-neutral-500">Seq Scan on messages  (cost=0.00..4382.00 rows=180 width=64)</div>
      <div className="pl-4 text-neutral-400 dark:text-neutral-600">Filter: (chat_id = 42)</div>
      <div className="pl-4 text-neutral-400 dark:text-neutral-600">Rows Removed by Filter: 213820</div>
      <div className="text-neutral-500 dark:text-neutral-400">Planning Time: 0.110 ms</div>
      <div className="text-neutral-500 dark:text-neutral-400">Execution Time: 48.943 ms</div>
      <div className="mt-3 text-neutral-400 dark:text-neutral-500">=# CREATE INDEX idx_messages_chat ON messages (chat_id);</div>
      <div className="mt-2 text-neutral-800 dark:text-neutral-200 border-l-2 border-blue-500 dark:border-blue-400 pl-2">Index Scan using idx_messages_chat on messages  (cost=0.42..12.19 rows=180)</div>
      <div className="text-neutral-500 dark:text-neutral-400">Execution Time: 0.212 ms</div>
    </Terminal>
    <div className="mt-3">
      <Note center>The plan doesn't lie: 213,820 rows read and thrown away to return 180. One index later, 48ms becomes 0.2ms.</Note>
    </div>
  </div>
);

const CompoundIndex = () => (
  <div>
    <Label>Index on (user_id, created_at) — sorted by user_id first</Label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
      <div className="flex flex-col gap-2">
        <Box tone="good">WHERE user_id = 7 AND created_at &gt; …</Box>
        <Note>✓ Index Scan — seeks straight to user 7, then range-reads by date.</Note>
      </div>
      <div className="flex flex-col gap-2">
        <Box tone="bad">WHERE created_at &gt; …</Box>
        <Note>✗ Seq Scan — the index is sorted by user_id first, so skipping it means the sort order is useless. Full table read.</Note>
      </div>
    </div>
  </div>
);

const RaceCondition = () => (
  <div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Transaction A</Label>
        <Box>SELECT count → 49</Box>
        <Arrow />
        <Box>49 &lt; 50 ✓ pass</Box>
        <Arrow />
        <Box tone="bad">INSERT application</Box>
      </div>
      <div>
        <Label>Transaction B</Label>
        <Box>SELECT count → 49</Box>
        <Arrow />
        <Box>49 &lt; 50 ✓ pass</Box>
        <Arrow />
        <Box tone="bad">INSERT application</Box>
      </div>
    </div>
    <div className="mt-3">
      <Note center>Both reads saw 49. Both checks passed. The drive is now at 51/50 — and no line of application code was wrong.</Note>
    </div>
  </div>
);

const ReadWriteRatio = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label>Normalized — pay on every read</Label>
      <Box>
        SELECT … FROM posts
        <br />
        JOIN users … JOIN reactions …
        <br />
        JOIN comments … JOIN tags …
      </Box>
      <div className="mt-2">
        <Note>5 joins, every request, thousands of times a day.</Note>
      </div>
    </div>
    <div>
      <Label>Denormalized — pay on every write</Label>
      <Box tone="good">
        SELECT … FROM posts
        <br />
        -- likes_count, author_name
        <br />
        -- already on the row
      </Box>
      <div className="mt-2">
        <Note>1 read. The cost moved to the write path: keep the copies in sync.</Note>
      </div>
    </div>
  </div>
);

const PgvectorQuery = () => (
  <div>
    <Terminal title="supabase — semantic memory lookup">
      <div>
        <span className="text-neutral-500 dark:text-neutral-400">SELECT</span> content, metadata
      </div>
      <div>
        <span className="text-neutral-500 dark:text-neutral-400">FROM</span> memories
      </div>
      <div>
        <span className="text-neutral-500 dark:text-neutral-400">WHERE</span> user_id = $1 <span className="text-neutral-400 dark:text-neutral-600">-- normal SQL filter</span>
      </div>
      <div>
        <span className="text-neutral-500 dark:text-neutral-400">ORDER BY</span> <span className="text-neutral-800 dark:text-neutral-200 border-b border-blue-500 dark:border-blue-400">embedding &lt;=&gt; $2</span> <span className="text-neutral-400 dark:text-neutral-600">-- cosine distance to the query vector</span>
      </div>
      <div>
        <span className="text-neutral-500 dark:text-neutral-400">LIMIT</span> 5; <span className="text-neutral-400 dark:text-neutral-600">-- 5 closest memories, by meaning</span>
      </div>
    </Terminal>
    <div className="mt-3">
      <Note center>One operator (&lt;=&gt;) is new. Everything else — the filter, the join potential, the transaction — is the same SQL it's always been.</Note>
    </div>
  </div>
);

const Tbl = ({ title, cols, rows, hl = [] }: { title?: string; cols: string[]; rows: (string | number)[][]; hl?: number[] }) => (
  <div className="overflow-x-auto">
    {title && <div className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 mb-1">{title}</div>}
    <table className="w-full border-collapse font-mono text-[10.5px]">
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c} className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-2 py-1 text-left font-semibold text-neutral-500 dark:text-neutral-400">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={hl.includes(i) ? 'bg-blue-50 dark:bg-blue-950/30' : ''}>
            {r.map((cell, j) => (
              <td key={j} className="border border-neutral-200 dark:border-neutral-800 px-2 py-1 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TableAnatomy = () => (
  <div>
    <Label>A table: columns are fields, each row is one record</Label>
    <Tbl
      title="users"
      cols={['id', 'name', 'email', 'created_at']}
      rows={[
        [1, 'Asha', 'asha@gmail.com', '2026-07-12'],
        [2, 'Kabir', 'kabir@yahoo.com', '2026-07-14'],
        [3, 'Meera', 'meera@gmail.com', '2026-07-17'],
      ]}
      hl={[1]}
    />
    <div className="mt-3">
      <Note>The highlighted row is one record — one user. The column names and their types (number, text, date) are fixed by the schema; the rows keep coming.</Note>
    </div>
  </div>
);

const QueryResult = () => (
  <div className="flex flex-col items-center">
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 font-sans text-[12px] text-neutral-700 dark:text-neutral-300">
      "Which users signed up this week?"
    </div>
    <Arrow />
    <Box tone="good" className="text-center">
      SELECT name, email FROM users
      <br />
      WHERE created_at &gt; '2026-07-11'
    </Box>
    <Arrow />
    <div className="w-full sm:w-auto sm:min-w-[320px]">
      <Tbl
        cols={['name', 'email']}
        rows={[
          ['Kabir', 'kabir@yahoo.com'],
          ['Meera', 'meera@gmail.com'],
        ]}
      />
    </div>
  </div>
);

const SystemArchitecture = () => (
  <div className="flex flex-col items-center">
    <Box className="w-full sm:w-64 text-center">Browser / App</Box>
    <div className="flex items-center gap-2 py-1">
      <span className="text-neutral-300 dark:text-neutral-600 text-xs">↓</span>
      <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">GET /api/feed</span>
    </div>
    <Box className="w-full sm:w-64 text-center">
      API server
      <span className="block font-sans text-[10px] text-neutral-400 dark:text-neutral-500">this is where the SQL gets written</span>
    </Box>
    <div className="flex items-center gap-2 py-1">
      <span className="text-neutral-300 dark:text-neutral-600 text-xs">↓</span>
      <span className="font-mono text-[10px] text-blue-700 dark:text-blue-300">SELECT … FROM posts WHERE …</span>
    </div>
    <Box tone="good" className="w-full sm:w-64 text-center">Database</Box>
    <div className="flex items-center gap-2 py-1">
      <span className="text-neutral-300 dark:text-neutral-600 text-xs">↑</span>
      <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">rows come back → API turns them into JSON → screen</span>
    </div>
  </div>
);

const JoinTables = () => (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Tbl
        title="users"
        cols={['id', 'name']}
        rows={[
          [1, 'Asha'],
          [2, 'Kabir'],
        ]}
      />
      <Tbl
        title="orders"
        cols={['id', 'user_id', 'total']}
        rows={[
          [101, 1, '₹499'],
          [102, 2, '₹1,250'],
          [103, 1, '₹89'],
        ]}
      />
    </div>
    <div className="flex justify-center my-3">
      <Box tone="good" className="text-center">
        SELECT u.name, o.total FROM orders o
        <br />
        JOIN users u ON u.id = o.user_id
      </Box>
    </div>
    <div className="flex justify-center">
      <div className="w-full sm:w-auto sm:min-w-[280px]">
        <Tbl
          title="result — matched on users.id = orders.user_id"
          cols={['name', 'total']}
          rows={[
            ['Asha', '₹499'],
            ['Kabir', '₹1,250'],
            ['Asha', '₹89'],
          ]}
        />
      </div>
    </div>
  </div>
);

const DIAGRAMS: Record<string, React.FC> = {
  'table-anatomy': TableAnatomy,
  'query-result': QueryResult,
  'system-architecture': SystemArchitecture,
  'join-tables': JoinTables,
  'n-plus-one': NPlusOne,
  'query-planner': QueryPlanner,
  'explain-output': ExplainOutput,
  'compound-index': CompoundIndex,
  'race-condition': RaceCondition,
  'read-write-ratio': ReadWriteRatio,
  'pgvector-query': PgvectorQuery,
};

export default function BlogDiagram({ id, caption }: { id: string; caption?: string }) {
  const Diagram = DIAGRAMS[id];
  if (!Diagram) return null;
  return (
    <figure className="my-8 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5">
      <Diagram />
      {caption && (
        <figcaption className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[12px] font-sans text-neutral-400 dark:text-neutral-500 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
