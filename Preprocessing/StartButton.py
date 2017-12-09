from PyQt5.QtWidgets import QCheckBox, QWidget, QPushButton

class StartButton(QWidget):
    def __init__(self, window):
        super().__init__()
        self.parent_window = window
        self.checkbox_init()

    def checkbox_init(self):
        self.button = QPushButton("Start", parent=self.parent_window)
        self.button.move(10, 100)
        self.button.resize(50, 50)
        self.button.clicked.connect(self.func)

    def func(self):
        self.parent_window.preprocessing_manager.preprocess()