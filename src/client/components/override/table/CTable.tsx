import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import React from 'react';


type CTableProps = DataGridProps;

export default function CTable(props: CTableProps) {
  const {
    pageSize: pageSizeProp = 5,
    ...restProps
  } = props;

  const [pageSize, setPageSize] = React.useState(Math.min(pageSizeProp, 100));
  const handlePageSizeChange = React.useCallback((newPageSize: number) => {
    // apiRef.current.setPageSize(newPageSize);
    setPageSize(newPageSize);
  }, []);

  return (
    <DataGrid
      pageSize={pageSize}
      rowsPerPageOptions={[
        Math.round(pageSize / 3),
        Math.round(pageSize / 2),
        pageSize,
        pageSize * 2,
        pageSize * 3
      ].filter((pageSizeI) => pageSizeI > 0)}
      onPageSizeChange={handlePageSizeChange}
      {...restProps}
    />
  );
}
