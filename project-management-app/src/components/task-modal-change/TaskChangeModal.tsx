import React, { FC } from 'react';
import styles from './TaskChangeModal.module.scss';
import cn from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { updateTask } from '../../api/tasks';
import { ITask } from '../../models/ITask';
import { useTranslation } from 'react-i18next';
import { fileUpload } from '../../api/files';
import cross from './../board-modal/assets/cross.svg';
import { supportedImageFormat } from '../../constants/supportedImageFormat';
import LoadingAnimation from '../loading-animation/LoadingAnimation';
import upload from './assets/upload.png';

interface IProps {
  task: ITask;
  isOpenChangeTaskModal: boolean;
  setIsOpenChangeTaskModal: (val: boolean) => void;
  numberTask: number;
}

const TaskChangeModal: FC<IProps> = ({
  task,
  isOpenChangeTaskModal,
  setIsOpenChangeTaskModal,
  numberTask,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading, urlImages } = useAppSelector((state) => state.tasks);
  const { t } = useTranslation();
  const hasImage = !!task.files?.length || false;
  const urlImage = urlImages.find((el) => el.taskId === task.id)?.urlImage;

  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenChangeTaskModal })}
      onClick={() => setIsOpenChangeTaskModal(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <img
          className={styles.cross}
          src={cross}
          alt="cross"
          onClick={() => setIsOpenChangeTaskModal(false)}
        />
        <h2>{`${t('task_number')} ${numberTask}`}</h2>
        <Formik
          initialValues={{
            title: task.title,
            description: task.description,
            file: '' as '' | File,
          }}
          onSubmit={({ title, description, file }) => {
            dispatch(
              updateTask({
                boardId: task.boardId,
                columnId: task.columnId,
                taskId: task.id,
                data: {
                  title: title,
                  order: task.order,
                  description: description,
                  userId: task.userId,
                  boardId: task.boardId,
                  columnId: task.columnId,
                },
              })
            );

            if (file && !hasImage) {
              dispatch(fileUpload({ taskId: task.id, file: file }));
            }
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .min(4, t('must_be_more_than_4_characters'))
              .max(12, t('must_be_less_than_12_characters'))
              .required(t('title_is_required')),
            description: Yup.string()
              .min(2, t('must_be_more_than_2_characters'))
              .required(t('description_is_required')),
            file: Yup.mixed()
              .test('fileSize', t('error-image_size'), (img) => {
                if (hasImage) {
                  return true;
                }
                if (typeof img === 'object') {
                  return img?.size <= 500000;
                } else {
                  return true;
                }
              })
              .test('type', t('error-image_type'), (img) => {
                if (hasImage) {
                  return true;
                }
                if (typeof img === 'object') {
                  return supportedImageFormat.includes(img?.type);
                } else {
                  return true;
                }
              }),
          })}
        >
          {({ handleSubmit, setFieldValue, values }) => {
            return (
              <Form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="title">
                  {t('title_task')}
                  <Field id="title" name="title" />
                  <div className={styles.error}>
                    <ErrorMessage name="title" />
                  </div>
                </label>
                <label htmlFor="description">
                  {t('description_task')}
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className={styles.text_area}
                  />
                  <div className={styles.error}>
                    <ErrorMessage name="description" />
                  </div>
                </label>
                {!hasImage && (
                  <label className={styles.file} htmlFor="file">
                    <div>{t('choose_image')}</div>
                    <img width={50} src={upload} alt="upload" />
                    <input
                      id="file"
                      type="file"
                      name="file"
                      onChange={(event: React.ChangeEvent) => {
                        const target = event.target as HTMLInputElement;
                        const file: File = (target.files as FileList)[0];
                        setFieldValue('file', file);
                      }}
                    />
                    {values.file && <p>{values.file.name}</p>}
                    <div className={styles.error}>
                      <ErrorMessage name="file" />
                    </div>
                  </label>
                )}
                {urlImage && (
                  <div className={styles.image}>
                    <img src={urlImage} alt="image of task" />
                  </div>
                )}
                <div className={styles.sub_btn}>
                  <div className={styles.loader}>{isLoading && <LoadingAnimation />}</div>
                  <button type="submit" disabled={isLoading}>
                    {t('update')}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default TaskChangeModal;
