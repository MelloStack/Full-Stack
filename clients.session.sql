CREATE TABLE users (
    Userid INT,
    Username VARCHAR(255)
)

CREATE TABLE messages (
    MessageId INT,
    MessageBody VARCHAR(9999)
)

INSERT INTO users (Userid, Username)
VALUES (1, 'Luiz Felipe')

INSERT INTO messages (MessageId, MessageBody)
VALUES (1, 'Ola, Testando')