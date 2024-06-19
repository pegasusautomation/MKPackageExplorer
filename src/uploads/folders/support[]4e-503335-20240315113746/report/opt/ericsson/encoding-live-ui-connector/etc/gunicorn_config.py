import multiprocessing

# https://github.com/benoitc/gunicorn/blob/master/examples/example_config.py

bind = "0.0.0.0:9499"
backlog = 2048

workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gevent'
worker_connections = 1000
timeout = 30
keepalive = 2

spew = False

loglevel = 'warn'
logfile = '-'
errorlog = '-'
accesslog = '-'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

daemon = False

