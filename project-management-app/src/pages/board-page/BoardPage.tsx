import React, { useEffect, useState } from 'react';
import styles from './BoardPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { getColumns } from '../../api/columns';
import Column from '../../components/column/Column';
import { IColumn } from '../../models/IColumn';
import Header from '../../components/header/Header';
import ColumnModal from '../../components/column-modal/ColumnModal';
import { useTranslation } from 'react-i18next';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { setColumns } from '../../store/columnsSlice';

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, columns, boardId } = useAppSelector((state) => state.columns);
  const [isOpenColumn, setIsOpenColumn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getColumns(boardId));
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [error]);

  const reorder = (list: IColumn[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newColumns = reorder(columns, source.index, destination.index);
    dispatch(setColumns(newColumns));
    console.log(result);
  };

  return (
    <div className={styles.container}>
      <Header />
      <ToastContainer />
      <div className={styles.board}>
        {isLoading && (
          <div className={styles.loader}>
            <LoadingAnimation />
          </div>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div className={styles.boar} {...provided.droppableProps} ref={provided.innerRef}>
                {columns?.map((column: IColumn, index: number) => {
                  return (
                    <Draggable key={column.id} draggableId={column.id as string} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Column column={column} />;
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button className={styles.buttonAddColumn} onClick={() => setIsOpenColumn(true)}>
          {t('add_column')}
        </button>
        <ColumnModal isOpenColumn={isOpenColumn} setIsOpenColumn={setIsOpenColumn} />
      </div>
    </div>
  );
};

export default BoardPage;
