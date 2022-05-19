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
import { resetCreateNewTask, setTasks } from '../../store/tasksSlice';

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, columns, boardId, errorColumn, isCreateColumn } = useAppSelector(
    (state) => state.columns
  );
  const { tasks } = useAppSelector((state) => state.tasks);
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

  const reorder = (arr: IColumn[], startIndex: number, endIndex: number) => {
    const result = [...arr];
    const startItem = { ...result[startIndex] };
    const endItem = { ...result[endIndex] };
    [startItem.order, endItem.order] = [endItem.order, startItem.order];
    result.splice(startIndex, 1, startItem);
    result.splice(endIndex, 1, endItem);
    result.sort((a, b) => a.order - b.order);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    console.log(result);

    if (!destination) return;

    if (type === 'column') {
      const newColumns = reorder(columns, source.index, destination!.index);
      dispatch(setColumns(newColumns));
      return;
    }

    //reordering in same list
    if (result.source.droppableId === destination.droppableId) {
      const tasksOfColumn = tasks[source.droppableId];
      const newTasks = reorder(tasksOfColumn, source.index, destination.index);
      dispatch(setTasks({ newTasks, columnId: source.droppableId }));
      return;
    }

    // moving between lists
    const sourceColumn = tasks[source.droppableId];
    const destinationColumn = tasks[destination.droppableId];
    const item = sourceColumn[source.index];

    // 1. remove item from source column
    const newSourceColumn = [...sourceColumn];
    newSourceColumn.splice(source.index, 1);

    // 2. insert into destination column
    const newDestinationColumn = [...destinationColumn];
    // in line modification of items
    newDestinationColumn.splice(destination.index, 0, item);

    dispatch(setTasks({ newTasks: newSourceColumn, columnId: source.droppableId }));
    dispatch(setTasks({ newTasks: newDestinationColumn, columnId: destination.droppableId }));
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
        {isLoading && (
          <div className={styles.loader}>
            <LoadingAnimation />
          </div>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-droppable" direction="horizontal" type="column">
            {(provided) => (
              <div
                className={styles.board__body}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {columns?.map((column: IColumn, index: number) => (
                  <Column key={column.id} column={column} index={index} />
                ))}
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
