#!/bin/sh

usage() { 
	echo "get-shellcode.sh" 1>&2;
	echo "adapted from https://www.commandlinefu.com/commands/view/14270/get-all-shellcode-on-binary-file-from-objdump" 1>&2;
	echo "Usage: get-shellcode -f <binary file>" 1>&2;
	exit 1; 
}

while getopts "f:" arg; do
    case $arg in
        f)
            bin=${OPTARG}
            ;;
        *)
            usage
            exit 0
            ;;
    esac
done
shift $((OPTIND-1))

if [ -z "${bin}" ]; then
    usage
fi

objdump -d $bin | grep -Po '\s\K[a-f0-9]{2}(?=\s)' | sed 's/^/\\x/g' | perl -pe 's/\r?\n//' | sed 's/$/\n/'