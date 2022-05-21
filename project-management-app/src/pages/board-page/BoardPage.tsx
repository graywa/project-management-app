import React, { useEffect, useState } from 'react';
import styles from './BoardPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { changeColumnsOrder, getColumns, updateColumn } from '../../api/columns';
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
import { resetCreateNewTask, resetUpdateTask, setTasks } from '../../store/tasksSlice';
import { ITask } from '../../models/ITask';
import { changeTasksOrderOneColumn, changeTasksOrderTwoColumns } from '../../api/tasks';

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, columns, boardId, errorColumn, isCreateColumn } = useAppSelector(
    (state) => state.columns
  );

  const { tasks } = useAppSelector((state) => state.tasks);
  const { isCreateTask, isUpdateTask, errorTask } = useAppSelector((state) => state.tasks);
  const [isOpenColumn, setIsOpenColumn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getColumns(boardId));
  }, [columns.length]);

  useEffect(() => {
    if (errorTask) {
      toast.error(errorTask, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [errorTask]);

  //local reorder
  const reorder = (arr: IColumn[] | ITask[], startIndex: number, endIndex: number) => {
    const result = [...arr];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.forEach((el, index) => {
      const newEl = { ...el };
      newEl.order = index + 1;
      result[index] = newEl;
    });

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    const startIndex = source.index;
    const endIndex = destination.index;

    if (type === 'column') {
      //const startItem = columns[source.index];
      //const endItem = columns[destination.index];
      //const newColumns = reorder(columns, startIndex, endIndex);
      //dispatch(setColumns(newColumns));
      if (startIndex === endIndex) return;

      dispatch(
        changeColumnsOrder({ boardId, startIndex, endIndex, columns: columns as IColumn[] })
      );
      return;
    }

    //reordering in same list
    if (source.droppableId === destination.droppableId) {
      if (startIndex === endIndex) return;
      const tasksOfColumn = tasks[source.droppableId];
      const columnId = source.droppableId;
      //const newTasks = reorder(tasksOfColumn, source.index, destination.index);
      //dispatch(setTasks({ newTasks, columnId: source.droppableId }));
      dispatch(
        changeTasksOrderOneColumn({ boardId, columnId, startIndex, endIndex, tasksOfColumn })
      );
      return;
    }

    // moving between lists
    const sourceColumn = tasks[source.droppableId];
    const destinationColumn = tasks[destination.droppableId];
    const destinationColumnId = destination.droppableId;

    dispatch(
      changeTasksOrderTwoColumns({
        boardId,
        sourceColumn,
        destinationColumn,
        startIndex,
        endIndex,
        destinationColumnId,
      })
    );
    //const item = sourceColumn[source.index];

    // 1. remove item from source column
    // const newSourceColumn = [...sourceColumn];
    // newSourceColumn.splice(source.index, 1);

    // 2. insert into destination column
    //const newDestinationColumn = [...destinationColumn];
    // in line modification of items
    //newDestinationColumn.splice(destination.index, 0, item);

    // dispatch(setTasks({ newTasks: newSourceColumn, columnId: source.droppableId }));
    // dispatch(setTasks({ newTasks: newDestinationColumn, columnId: destination.droppableId }));
  };

  useEffect(() => {
    if (isCreateColumn) {
      toast.success(t('new_column_created'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetCreateNewColumn());
    }
    if (isCreateTask) {
      toast.success(t('new_task_created'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetCreateNewTask());
    }
    if (isUpdateTask) {
      toast.success(t('update_task'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetUpdateTask());
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
  }, [errorColumn, errorTask, isCreateColumn, isCreateTask, isUpdateTask]);

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
