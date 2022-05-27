import React, { FC, useEffect, useState } from 'react';
import styles from './TaskChangeModal.module.scss';
import cn from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { updateTask } from '../../api/tasks';
import { ITask } from '../../models/ITask';
import { useTranslation } from 'react-i18next';
import { supportedImageFormat } from '../../constants/supportedImageFormat';
import { fileDownload, fileUpload } from '../../api/files';
import cross from './../board-modal/assets/cross.svg';

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
  const { login } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const image = localStorage.getItem(task.id);
  const [urlImage, setUrlImage] = useState('');

  async function downloadImage() {
    if (image) {
      const url = await dispatch(fileDownload({ taskId: task.id, fileName: image }));
      const { payload: urlImage } = url;

      setUrlImage(urlImage as string);
    }
  }

  useEffect(() => {
    downloadImage();
  }, [image]);

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
        {image && (
          <div className={styles.image}>
            <img src={urlImage} alt="image of task" />
          </div>
        )}
        <Formik
          initialValues={{
            title: task.title,
            description: task.description,
            file: Blob,
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

            if (typeof file === 'object' && !image) {
              dispatch(fileUpload({ taskId: task.id, file: file, fileName: file['name'] }));
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
              .test('size', t('error-image_size'), (img) => {
                if (image) {
                  return true;
                }
                if (typeof img === 'object') {
                  return img.size <= 500000;
                } else {
                  return true;
                }
              })
              .test('type', t('error-image_type'), (img) => {
                if (image) {
                  return true;
                }
                if (typeof img === 'object') {
                  return supportedImageFormat.includes(img.type);
                } else {
                  return true;
                }
              }),
          })}
        >
          {({ handleSubmit, setFieldValue }) => {
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
                {!image && (
                  <label htmlFor="file">
                    {t('image')}
                    <input
                      id="file"
                      type="file"
                      onChange={(event: React.ChangeEvent) => {
                        const target = event.target as HTMLInputElement;
                        const file: File = (target.files as FileList)[0];
                        setFieldValue('file', file);
                      }}
                    />
                    <div className={styles.error}>
                      <ErrorMessage name="file" />
                    </div>
                  </label>
                )}
                <h4>
                  <span>{t('user')}</span> - {login}
                </h4>
                <div className={styles.sub_btn}>
                  <button type="submit">{t('update')}</button>
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
