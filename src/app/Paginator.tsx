import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginatorProps {
  totalPages: number;
  onPageChange: (selectedPage: { selected: number }) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ totalPages, onPageChange }) => {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      onPageChange={onPageChange}
      containerClassName={'pagination'}
      activeClassName={'active'}
    />
  );
};

export default Paginator;
