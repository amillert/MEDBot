_FAKE_DB = {
    'doctors': [{'id': '1', 'name': 'test_doc'}, {'id': '2', 'name': 'test2'}],
    'patients': [{'id': '1', 'name': 'test_patient'}, {'id': '2', 'name': 'test2'}],
    'meds': [{'id': '1', 'name': 'test_med'}, {'id': '2', 'name': 'test2'}]
}

def create(table_name, obj):
    _FAKE_DB[table_name].append(obj)


def get_all(table_name):
    return _FAKE_DB[table_name]


def get(table_name, id):
    for i in _FAKE_DB[table_name]:
        if i['id'] == id:
            return i
    return None


def update(table_name, obj):
    for ind, val in enumerate(_FAKE_DB[table_name]):
        if val['id'] == obj.get('id'):
            _FAKE_DB[table_name][ind] = obj
            return True
    return False
            


def delete(table_name, id):
    for ind, val in enumerate(_FAKE_DB[table_name]):
        if val['id'] == id:
            del _FAKE_DB[table_name][ind]
            return True
    return False
    