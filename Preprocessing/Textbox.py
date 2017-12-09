from PyQt5.QtWidgets import QWidget, QLineEdit

class Textbox(QWidget):
    def __init__(self, parent_window, position):
        super().__init__()
        self.textbox = QLineEdit(parent=parent_window)
        self.textbox.move(position[0], position[1])
        self.textbox.resize(200, 30)

