from PyQt5.QtWidgets import QWidget, QLabel
from Checkbox import Checkbox
from Textbox import Textbox
from StartButton import StartButton
from PreprocessingManager import PreprocessingManager

class Window(QWidget):
    def __init__(self):
        super().__init__()
        self.checkbox = Checkbox(self)
        self.textbox_directory = Textbox(self,(210, 10))
        self.textbox_filename = Textbox(self, (210, 60))
        self.start_button = StartButton(self)
        self.preprocessing_manager = PreprocessingManager(self)
        self.label_dir = QLabel(parent=self, text="Folder name (empty for current)")
        self.label_dir.move(10, 20)
        self.label_dir = QLabel(parent=self, text="File name (empty for all files)")
        self.label_dir.move(10, 70)