import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          reminderTypes: {
            title: 'Reminder Types',
            listTitle: 'List of Reminder Types',
            name: 'Name',
            description: 'Description',
            addNew: 'Add New',
            addTitle: 'Add Reminder Type',
            namePlaceholder: 'Enter type name',
            descriptionPlaceholder: 'Enter type description',
            emptyList: 'No reminder types found',
            nameRequired: 'Name is required',
            createSuccess: 'Reminder type created successfully',
            updateSuccess: 'Reminder type updated successfully',
            deleteSuccess: 'Reminder type deleted successfully',
            deleteError: 'Failed to delete reminder type',
            saveError: 'Failed to save reminder type'
          },
          common: {
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this item?',
            yes: 'Yes',
            no: 'No',
            loading: 'Loading...',
            error: 'Error'
          }
        }
      },
      uk: {
        translation: {
          reminderTypes: {
            title: 'Типи нагадувань',
            listTitle: 'Список типів нагадувань',
            name: 'Назва',
            description: 'Опис',
            addNew: 'Додати новий',
            addTitle: 'Додати тип нагадування',
            namePlaceholder: 'Введіть назву типу',
            descriptionPlaceholder: 'Введіть опис типу',
            emptyList: 'Типи нагадувань відсутні',
            nameRequired: 'Назва обов\'язкова',
            createSuccess: 'Тип нагадування створено успішно',
            updateSuccess: 'Тип нагадування оновлено успішно',
            deleteSuccess: 'Тип нагадування видалено успішно',
            deleteError: 'Не вдалося видалити тип нагадування',
            saveError: 'Не вдалося зберегти тип нагадування'
          },
          common: {
            actions: 'Дії',
            edit: 'Редагувати',
            delete: 'Видалити',
            deleteConfirm: 'Ви впевнені, що хочете видалити цей елемент?',
            yes: 'Так',
            no: 'Ні',
            loading: 'Завантаження...',
            error: 'Помилка'
          }
        }
      }
    },
    lng: 'uk',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 