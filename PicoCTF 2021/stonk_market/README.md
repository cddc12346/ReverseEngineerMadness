This was done on kali, incomplete, only did until leak libc.

# Exploitation concept

## Step 1

Results after sending 20%p:
0x7ffff7faf723_(nil)_0x7ffff7edeed3_0x1a_0xffffffffffffff80_(nil)_0x6032a0_(nil)_0x200000000_0x604350_0x604370_0x7fffffffe520_0x400c66_0x7fffffffe618_0x100000000_0x400ca0_0x100400780_0x6032a0_0xfd42c7a9aa9e1100_0x400ca0_

0x7fffffffe520 points to 0x400ca0 that will be printed out later

if we overwrite 0x7fffffffe520 to exit_got, later on there will be a pointer to exit_got that will be printed...

We can then overwrite exit_got to restart the binary

## Step 2

Now we just have to leak libc address, can be done with just format string vuln

## Step 3 

Identify libc and one-shot


# Learning point:
1) never thought of the 2 step...
2) Pay attention to stack leak and its pointer, it could be leaked again