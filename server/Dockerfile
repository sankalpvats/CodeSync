FROM node:20


# Install Python, Java and C++
RUN apt-get update && apt-get install -y \
    python3 \
    g++ \
    default-jdk

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "start"]