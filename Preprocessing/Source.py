import sys
from Window import Window
from PyQt5.QtWidgets import QApplication

if __name__ == '__main__':
    app = QApplication(sys.argv)

    my_scr = Window()
    my_scr.setWindowTitle("Pre-processing of MutS simulation data")
    my_scr.resize(420, 160)
    my_scr.show()

    sys.exit(app.exec_())