FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt /tmp/requirements.txt
COPY requirements.dev.txt /tmp/requirements.dev.txt
COPY app /app

ARG DEV=false

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    if [ "$DEV" = true ]; then \
        /py/bin/pip install -r /tmp/requirements.dev.txt; \
    fi && \
    rm -rf /tmp && \
    cp /usr/share/zoneinfo/Europe/Kyiv /etc/localtime && \
    echo "Europe/Kyiv" > /etc/timezone && \
    adduser --disabled-password --no-create-home app-user

ENV PATH="/py/bin:$PATH"

USER app-user

EXPOSE 8005
