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
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { setColumns } from '../../store/columnsSlice';
import { toast, ToastContainer } from 'react-toastify';
import { resetCreateNewColumn } from '../../store/columnsSlice';
import { resetCreateNewTask } from '../../store/tasksSlice';

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, columns, boardId, errorColumn, isCreateColumn } = useAppSelector(
    (state) => state.columns
  );
  const { isCreateTask, errorTask } = useAppSelector((state) => state.tasks);
  const [isOpenColumn, setIsOpenColumn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getColumns(boardId));
  }, []);

  useEffect(() => {
    if (errorTask) {
      toast.error(errorTask, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [errorTask]);

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

  useEffect(() => {
    if (isCreateColumn) {
      toast.success('New column created', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetCreateNewColumn());
    }
    if (isCreateTask) {
      toast.success('New task created', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetCreateNewTask());
    }
    if (errorColumn !== 'Unauthorized' && errorColumn !== '') {
      toast.error(errorColumn, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
    if (errorTask !== 'Unauthorized' && errorTask !== '') {
      toast.error(errorTask, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [errorColumn, errorTask, isCreateColumn, isCreateTask]);

  return (
    <div className={styles.container}>
      <Header />
      <ToastContainer />
      <div className={styles.board}>
        <ToastContainer />
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
