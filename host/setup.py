from distutils.core import setup
import py2exe

setup(console=['useie-host'],options = {
  "py2exe":{
    "includes": ["os","linecache"]
  }
})
