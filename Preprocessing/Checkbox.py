from PyQt5.QtWidgets import QCheckBox, QWidget, QPushButton

class Checkbox(QWidget):
    def __init__(self, window):
        super().__init__()
        self.parent_window = window
        self.checkbox_init()

    def checkbox_init(self):
        self.checkbox = QCheckBox("Remove original *-s.txt and *-p.txt files", parent=self.parent_window)
        self.checkbox.move(100, 115)
