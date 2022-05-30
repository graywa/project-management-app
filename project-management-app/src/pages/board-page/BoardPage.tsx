import React, { useEffect } from 'react';
import styles from './BoardPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { changeColumnsOrder, getColumns } from '../../api/columns';
import Column from '../../components/column/Column';
import { IColumn } from '../../models/IColumn';
import Header from '../../components/header/Header';
import { useTranslation } from 'react-i18next';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { toast, ToastContainer } from 'react-toastify';
import { resetCreateNewColumn } from '../../store/columnsSlice';
import { resetCreateNewTask, resetUpdateTask } from '../../store/tasksSlice';
import { changeTasksOrderOneColumn, changeTasksOrderTwoColumns } from '../../api/tasks';
import { getBoards } from '../../api/boards';

const BoardPage = React.memo(() => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { boards } = useAppSelector((state) => state.boards);
  const { isLoading, columns, boardId, errorColumn, isCreateColumn } = useAppSelector(
    (state) => state.columns
  );
  const targetBoard = boards.find((el) => el.id === boardId);
  const { isCreateTask, isUpdateTask, errorTask, tasks } = useAppSelector((state) => state.tasks);
  const { t } = useTranslation();

  useEffect(() => {
    if (!boards.length) {
      dispatch(getBoards(token));
    }
  }, [boards.length]);

  useEffect(() => {
    dispatch(getColumns(boardId));
  }, [boardId]);

  useEffect(() => {
    if (errorTask) {
      toast.error(errorTask, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [errorTask]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    const startIndex = source.index;
    const endIndex = destination.index;

    if (type === 'column') {
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
      <h1 className={styles.title}>{targetBoard?.title}</h1>
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
                {!!columns.length ? (
                  columns?.map((column: IColumn, index: number) => (
                    <Column key={column.id} column={column} index={index} />
                  ))
                ) : (
                  <h4>{t('columns_not_found')}</h4>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
});

export default BoardPage;
