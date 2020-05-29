package readfile;

import "io/ioutil"

func readFile(path string) (string, error) {
	_readdata, _readerr := ioutil.ReadFile(path);
	return _readdata, _readerr;
}