# Learning Points

Vulnerable application can be downloaded here:

https://www.exploit-db.com/exploits/9618

1) Overwrite pointer to Exception Handler to a Rop gadget that does pop pop ret

2) Returns to address at nSEH

3) **!address on the nSEH shows non-executable region. However, it is actually executable...**