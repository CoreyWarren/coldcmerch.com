FROM python:3.10.4

WORKDIR /coldcmerch


# Set environment variables
ENV DJANGO_SECRET_KEY DJANGO_SECRET_KEY

    # Database
ENV DATABASE_NAME DATABASE_NAME
ENV DATABASE_USER DATABASE_USER
ENV DATABASE_PASSWORD DATABASE_PASSWORD

    # Stripe
ENV STRIPE_PUBLIC_KEY STRIPE_PUBLIC_KEY
ENV STRIPE_SECRET_KEY STRIPE_SECRET_KEY
ENV STRIPE_WEBHOOK_SECRET STRIPE_WEBHOOK_SECRET



COPY ./django-requirements.txt ./
RUN pip install --no-cache-dir -r django-requirements.txt

COPY . .

RUN python manage.py collectstatic --no-input

CMD ["gunicorn", "coldcmerch.wsgi:application", "--bind", "0.0.0.0:8000"]
