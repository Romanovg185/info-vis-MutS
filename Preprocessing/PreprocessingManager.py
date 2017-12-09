from Preprocess import preprocess_file, preprocess_and_remove, preprocess_all
import os

class PreprocessingManager(object):
    def __init__(self, parent_window):
        self.parent_window = parent_window

    def preprocess(self):
        acceptable = ['all', 'all files', 'All', 'All files', 'ALL']
        directory_name = self.parent_window.textbox_directory.textbox.text()
        if len(directory_name) == 0:
            my_path = os.path.dirname(os.path.abspath(__file__))
            directory_name = my_path

        file_name = self.parent_window.textbox_filename.textbox.text()
        if len(file_name) != 0 and file_name[-6:] != "-p.txt":
            file_name = file_name + "-p.txt"
        if len(file_name) == 0 or file_name in acceptable:
            if self.parent_window.checkbox.checkbox.isChecked():
                preprocess_all(directory_name, remove=True)
            else:
                preprocess_all(directory_name, remove=False)
        else:
            file_name = file_name.split(', ')
            for file in file_name:
                if self.parent_window.checkbox.checkbox.isChecked():
                    preprocess_and_remove(directory_name + '/' + file)
                else:
                    preprocess_file(directory_name + '/' + file)
        self.parent_window.close()

