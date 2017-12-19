import os
import glob


def read_position(position_file_name):
    """Reads in the timelapse position files and returns it in a neat list-of-lists"""
    total_position_read = []
    # position_read_data format: list-of-lists of form
    # * Time step
    # * Number of GATC sites
    # * Number of proteins
    # * Number of cuts at GATC1 till N
    # * Positions of protein 1 till N
    with open(position_file_name) as file:
        n_GATC = 0
        quirk_flag = False
        for i, line in enumerate(file):
            # ignore first two lines with info
            if i < 2:
                continue

            position_read_data = [0, 0, 0]
            line_list = line.split(' ')

            # removing nasty newlines
            if line_list[-1] == '\n':
                line_list.pop()
            elif '\n' in line_list[-1]:
                line_list[-1] = line_list[-1][:-1]

            # identify number of cutting sites
            if i == 2:
                n_GATC = len(line_list) - 1

            position_read_data[0] = round(float(line_list[0]), 2)
            position_read_data[1] = n_GATC

            # ignore Charlie's weird quirk...
            if line_list[n_GATC - 1] == '1' and line_list[n_GATC] == '1':
                quirk_flag = True
                position_read_data[2] = len(line_list[n_GATC + 2:])
            else:
                position_read_data[2] = len(line_list[n_GATC + 1:])

            # add gatc state
            for gatc in line_list[1:1 + n_GATC]:
                position_read_data.append(gatc)

            # add proteins
            if quirk_flag:
                for prot in line_list[n_GATC + 2:]:
                    position_read_data.append(prot)
            else:
                for prot in line_list[n_GATC + 1:]:
                    position_read_data.append(prot)

            total_position_read.append(position_read_data)
    return total_position_read

def read_status(status_file_name):
    total_status_read = []
    with open(status_file_name) as file:
        n_GATC = 2
        quirk_flag = False
        for i, line in enumerate(file):
            time_element = []
            line_list = line.split(' ')

            # removing nasty newlines
            if line_list[-1] == '\n':
                line_list.pop()
            elif '\n' in line_list[-1]:
                line_list[-1] = line_list[-1][:-1]

            if i == 0:
                n_GATC = len(line_list) - 1

            if line_list[n_GATC - 1] == '1' and line_list[n_GATC] == '1':
                quirk_flag = True

            if len(line_list) > n_GATC + 1:
                for status in line_list[n_GATC+1+quirk_flag:]:
                    time_element.append(status)
            total_status_read.append(time_element)
    return total_status_read

def merge_reads(positions, statuses):
    """
    Resulting format (per row):
    * Time stamp, rounded to 2 decimals
    * Number of GATC sites
    * Number of MutS
    * State of first, second, ... GATC site
    * Position first protein if present
    * State first protein if present
    * Second position
    * Second state
    ...
    """
    ret = []
    for position, status in zip(positions, statuses):
        timestep = []
        i_till_proteins = position[1]+3 # index where the protein positions start
        timestep.extend(position[:i_till_proteins])
        for i, protein in enumerate(position[i_till_proteins:]):
            timestep.append("{},{}".format(protein, status[i]))
        ret.append(timestep)
    return ret

def preprocess_file(position_file_name):
    # Generate status file name and output file name from position file name
    status_file_name = position_file_name
    status_file_name = [i for i in status_file_name]
    status_file_name[-5] = 's'
    status_file_name = ''.join(status_file_name)
    name_list = position_file_name.split('/')
    file_name = name_list[-1]
    name_list[-1] = file_name[:-6] + ".csv"
    write_name = "/".join(name_list)

    total_position_read = read_position(position_file_name=position_file_name)
    total_status_read = read_status(status_file_name)
    ret = merge_reads(total_position_read, total_status_read)
    with open(write_name, mode='w') as file:
        for data_point in ret:
            data_point_as_string = [str(i) for i in data_point]
            file.write(','.join(data_point_as_string))
            file.write('\n')

def preprocess_and_remove(position_file_name):
    preprocess_file(position_file_name)
    os.remove(position_file_name)
    status_file_name = position_file_name
    status_file_name = [i for i in status_file_name]
    status_file_name[-5] = 's'
    status_file_name = ''.join(status_file_name)
    os.remove(status_file_name)

def preprocess_all(directory_name, remove=False):
    all_files = glob.glob(directory_name + "/*-p.txt")
    for file in all_files:
        if remove:
            preprocess_and_remove(file)
        else:
            preprocess_file(file)




if __name__ == '__main__':
    preprocess_all("/home/romano/Desktop/Data_Visualization/infovis-project", remove=False)
