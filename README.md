# Instagram Clone

![Main Workflow](https://github.com/Archisman-Mridha/instagram-clone/actions/workflows/main.yaml/badge.svg)

Welcome to the `Instagram Clone` project, which aims to replicate the core functionalities of the popular social media platform, **Instagram**, while demonstrating :

> How to build and deploy fault tolerant distributed systems.

# Tech Stack

- `Rust` to write all the backend microservices (except the backend gateway microservice which is written in `GoLang`).

- [`Postgres`](https://postgresql.org) as the primary database.
- [`Meilisearch`](https://meilisearch.com) for implementing full text search feature.
- [`Redpanda`](https://redpanda.com) (a Kafka alternative) as the message broker | [`Debezium`](https://debezium.io) for implementing CDC (Change Data Capture).
- [`Vector`](https://vector.dev) for log ingestion | [`SigLens`](https://siglens.com) for centralized log, metric and trace collection.

- [`Docker`](https://docker.com) with `Docker Compose` to run everything in a development environment.

# Future Plans

- [ ] Write tests for the backend.
  > A blog by SemaphoreCI on `Testing Strategies For Microservices` - https://semaphoreci.com/blog/test-microservices

# Getting involved

If you encounter any bugs, have feature requests, or just want to discuss about the project, please open an issue.

# References

- [Microservices Patterns](https://www.oreilly.com/library/view/microservices-patterns/9781617294549/) book by Chris Richardson
- [Jordan has no life](https://www.youtube.com/@jordanhasnolife5163)'s Youtube video on [how to design a social media platform like Instagram](https://www.youtube.com/watch?v=S2y9_XYOZsg&pp=ygUqam9yZGFuIGhhcyBubyBsaWZlIGluc3RhZ3JhbSBzeXN0ZW0gZGVzaWdu)
- The [Rust Book](https://doc.rust-lang.org/book/)
- [Crust of Rust](https://youtube.com/playlist?list=PLqbS7AVVErFiWDOAVrPt7aYmnuuOLYvOa&si=-Y5Byig03EhhX0pi) Youtube playlist by [Jon Gjengset](https://www.youtube.com/@jonhoo)
- [Lazy Static Pattern in Rust](https://blog.logrocket.com/rust-lazy-static-pattern/)
- Youtube channels - [Mario Carrion](https://www.youtube.com/@MarioCarrion/playlists) | [Viktor Farcic](https://www.youtube.com/@DevOpsToolkit)
- [Vivek Singh](https://www.youtube.com/@viveksinghggits)'s Youtube playlist on [how to write a custom Kubernetes controller](https://www.youtube.com/playlist?list=PLh4KH3LtJvRTtFWz1WGlyDa7cKjj2Sns0)
- [Heiko's Blogs](https://heikoseeberger.de) on [how to instrument Rust codebase for Distrbuted Tracing](https://heikoseeberger.de/tags/opentelemetry/)
