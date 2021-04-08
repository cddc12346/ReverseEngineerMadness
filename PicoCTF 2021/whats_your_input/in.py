#!/usr/bin/python2 -u
import random

cities = open("./city_names.txt").readlines()
city = random.choice(cities).rstrip()
print(city)
year = 2018

print("What's your favorite number?")
res = None
while not res:
    try:
        res = input("Number? ")
        print("You said: {}".format(res))
    except:
        res = None

if res != year:
    print("Okay...")
else:
    print("I agree!")

print("What's the best city to visit?")
res = None
while not res:
    print('res = ', res)
    try:
        '''
        vuln is here at input using python version 2
        https://medium.com/@GallegoDor/python-exploitation-1-input-ac10d3f4491f
        by sending userinput = city, it will get the variable in city and put into res
        with this, we can bypass the checks later
        '''
        res = input("City? ")
        print("You said: {}".format(res))
    except:
        print("hit here")
        res = None

if res == city:
    print("I agree!")
    flag = open("./flag").read()
    print(flag)
else:
    print("Thanks for your input!")

